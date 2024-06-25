import { Injectable, signal, type WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, firstValueFrom } from 'rxjs';
import type { Jobs } from '../../../@types/Jobs';
import type { PageInfo } from '../../../@types/utils';
import type { BasePaginationService } from '../../../components/pagination/pagination.type';
import { JobsApiService } from '../../../core/api/jobs/jobs-api.service';

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

  public search$: Subject<void> = new Subject<void>();

  public skip: WritableSignal<number> = signal(0);

  public take: WritableSignal<number> = signal(15);

  public totalCount: WritableSignal<number> = signal(0);

  public dataSource = signal<Jobs[]>([]);

  public orderBy = signal('createdAt_ASC');

  public filters = signal<JobsFilters>({
    search: '',
    applicationStatus: null,
    archived: false,
  });

  public constructor(private readonly jobsApiService: JobsApiService) {
    this.search$.pipe(takeUntilDestroyed()).subscribe(() => {
      void this.searchJobs();
    });
  }

  public async searchJobs(): Promise<void> {
    this.isLoading.set(true);

    this.jobsApiService
      .getJobs({
        where: {
          applicationStatus: this.filters().applicationStatus ?? undefined,
          archived: this.filters().archived,
          nameContains: this.filters().search,
        },
        orderBy: this.orderBy(),
        limit: this.take(),
        offset: this.skip(),
      })
      .subscribe((response) => {
        this.dataSource.set(response.data);
        this.isLoading.set(false);
        this.pageInfo.set(response.pageInfo);
        this.totalCount.set(response.pageInfo.count);
      });
  }

  public resetFilters(): void {
    this.filters.set({
      search: '',
      applicationStatus: null,
      archived: false,
    });

    this.skip.set(0);
    this.search$.next();
  }

  public setFilters(filters: JobsFilters): void {
    this.filters.update((prevFilters) => ({
      ...prevFilters,
      ...filters,
    }));

    this.skip.set(0);
    this.search$.next();
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

      return [...prevData.slice(0, index), updatedJob, ...prevData.slice(index + 1)] as Jobs[];
    });

    this.isLoading.set(false);
  }
}
