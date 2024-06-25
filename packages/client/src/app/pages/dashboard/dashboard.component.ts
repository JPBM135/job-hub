import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, type OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Jobs } from '../../@types/Jobs';
import { LayoutComponent } from '../../components/layout/layout.component';
import { JobCardComponent } from './components/job-card/job-card.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent, ReactiveFormsModule, JobCardComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public searchForm = new FormGroup({
    search: new FormControl(''),
    applicationStatus: new FormControl<string | null>(null),
    archived: new FormControl<boolean>(false),
    orderBy: new FormControl<string>('createdAt_ASC'),
  });

  public isLoading = signal(false);

  public jobs = signal<Jobs[]>([]);

  public constructor(public readonly dashboardService: DashboardService) {
    this.searchForm.valueChanges.subscribe((value) => {
      console.log(value);
      this.isLoading.set(true);
      this.dashboardService.setFilters({
        search: value.search ?? undefined,
        applicationStatus: value.applicationStatus === 'null' ? null : value.applicationStatus ?? undefined,
        archived: value.archived ?? undefined,
      });
    });
  }

  public ngOnInit(): void {
    void this.dashboardService.searchJobs();
  }
}
