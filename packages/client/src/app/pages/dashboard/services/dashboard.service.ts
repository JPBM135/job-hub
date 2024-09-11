import { Injectable, signal, type WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, firstValueFrom } from 'rxjs';
import type { Jobs } from '../../../@types/Jobs';
import type { PageInfo } from '../../../@types/utils';
import type { BasePaginationService } from '../../../components/pagination/pagination.type';
import { JobsApiService } from '../../../core/api/jobs/jobs-api.service';
import { ApplicationModalComponent } from '../components/application-modal/application-modal.component';
import { JobInfoModalComponent } from '../components/job-info-modal/job-info-modal.component';
import { AlertService } from '../../../core/services/alert/alert.service';

interface JobsFilters {
  applicationStatus?: string | null;
  archived?: boolean;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService implements BasePaginationService {
  public isLoading: WritableSignal<boolean> = signal(false);

  public pageInfo: WritableSignal<PageInfo | undefined> = signal(undefined);

  public search$: Subject<boolean> = new Subject<boolean>();

  public skip: WritableSignal<number> = signal(0);

  public take: WritableSignal<number> = signal(15);

  public totalCount: WritableSignal<number> = signal(0);

  public dataSource = signal<Jobs[]>([]);

  public orderBy = signal('createdAt_DESC');

  public filters = signal<JobsFilters>({
    search: '',
    applicationStatus: null,
    archived: false,
  });

  public jobId: string = '';

  public applyJobId: string = '';

  public constructor(
    private readonly jobsApiService: JobsApiService,
    private readonly routes: ActivatedRoute,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly AlertService: AlertService,
  ) {
    this.search$.pipe(takeUntilDestroyed()).subscribe((fromPagination) => {
      void this.searchJobs(fromPagination);
    });
  }

  public async searchJobs(fromPagination: boolean): Promise<void> {
    this.isLoading.set(true);

    const response = await firstValueFrom(
      this.jobsApiService.getJobs({
        where: {
          applicationStatus: this.filters().applicationStatus ?? undefined,
          archived: this.filters().archived,
          nameContains: this.filters().search,
        },
        orderBy: this.orderBy(),
        limit: this.take(),
        offset: this.skip(),
      }),
    );

    if (!response) {
      return;
    }

    if (fromPagination) {
      this.dataSource.update((prevData) => [...prevData, ...response.data]);
    } else {
      this.dataSource.set(response.data);
    }

    this.isLoading.set(false);
    this.pageInfo.set(response.pageInfo);
    this.totalCount.set(response.pageInfo.count);

    const queryParams = this.routes.snapshot.queryParams;
    this.jobId = queryParams['jobId'];
    this.applyJobId = queryParams['applyJobId'];

    if (this.jobId && this.applyJobId) {
      this.openJobApplicationModal(this.jobId);
    } else if (this.jobId) {
      this.openJobInfoModal(this.jobId);
    } else if (this.applyJobId) {
      this.openJobApplicationModal(this.applyJobId);
    }
  }

  public resetFilters(): void {
    this.filters.set({
      search: '',
      applicationStatus: null,
      archived: false,
    });

    this.skip.set(0);
    this.search$.next(false);
  }

  public setOrderBy(orderBy: string): void {
    this.orderBy.set(orderBy);
    this.skip.set(0);
    this.search$.next(false);
  }

  public setFilters(filters: JobsFilters): void {
    this.filters.update((prevFilters) => ({
      ...prevFilters,
      ...filters,
    }));

    this.skip.set(0);
    this.search$.next(false);
  }

  public async applyOrUpdateJobApplication(job: Jobs, status: string) {
    this.isLoading.set(true);

    const application = await firstValueFrom(
      this.jobsApiService.applyOrUpdateJobApplication({
        jobId: job.id,
        status,
      }),
    );

    if (!application) {
      return;
    }

    this.dataSource.update((prevData) => {
      const index = prevData.findIndex((data) => data.id === job.id);

      if (index === -1) {
        return prevData;
      }

      const updatedJob = {
        ...prevData[index],
        application,
      };

      return [
        ...prevData.slice(0, index),
        updatedJob,
        ...prevData.slice(index + 1),
      ] as Jobs[];
    });

    this.isLoading.set(false);
  }

  public openJobInfoModal(jobId: string) {
    const data = this.dataSource().find((job) => job.id === jobId);

    if (!data) {
      this.AlertService.showError('Job not found');
      void this.router.navigate(['/dashboard']);
      return;
    }

    this.matDialog
      .open(JobInfoModalComponent, {
        data: { job: data },
      })
      .afterClosed()
      .subscribe(void this.router.navigate(['/dashboard']));
  }

  public openJobApplicationModal(applyJobId: string) {
    const data = this.dataSource().find((job) => job.id === applyJobId);

    if (!data) {
      alert('The job is not found');
      void this.router.navigate(['/dashboard']);
      return;
    }

    this.matDialog
      .open(ApplicationModalComponent, {
        data: { job: data },
      })
      .afterClosed()
      .subscribe(void this.router.navigate(['/dashboard']));
  }
}
