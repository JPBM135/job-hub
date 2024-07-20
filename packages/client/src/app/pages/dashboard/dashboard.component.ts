import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { Jobs } from '../../@types/Jobs';
import { LayoutComponent } from '../../components/layout/layout.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { JobCardComponent } from './components/job-card/job-card.component';
import { JobModalComponent } from './components/job-modal/job-modal.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    ReactiveFormsModule,
    JobCardComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PaginationComponent,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public searchForm = new FormGroup({
    search: new FormControl(''),
    applicationStatus: new FormControl<string | null>(null),
    archived: new FormControl<boolean>(false),
    remoteStatus: new FormControl<string | null>(null),
  });

  public orderByForm = new FormControl<string>('createdAt_DESC');

  public isLoading = signal(false);

  public jobs = signal<Jobs[]>([]);

  public constructor(
    public readonly dashboardService: DashboardService,
    private readonly matDialog: MatDialog,
  ) {
    this.searchForm.valueChanges.subscribe((value) => {
      this.isLoading.set(true);
      this.dashboardService.setFilters({
        search: value.search ?? undefined,
        applicationStatus:
          value.applicationStatus === 'null'
            ? null
            : value.applicationStatus ?? undefined,
        archived: value.archived ?? undefined,
      });
    });

    this.orderByForm.valueChanges.subscribe((value) => {
      this.dashboardService.setOrderBy(value!);
    });
  }

  public ngOnInit(): void {
    void this.dashboardService.searchJobs(false);
  }

  public createJob(): void {
    this.matDialog
      .open(JobModalComponent)
      .afterClosed()
      .subscribe(() => {
        void this.dashboardService.searchJobs(false);
      });
  }
}
