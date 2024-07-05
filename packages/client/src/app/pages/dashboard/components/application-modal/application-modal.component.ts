import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs';
import type { Jobs } from '../../../../@types/Jobs';
import { AlertService } from '../../../../core/services/alert/alert.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-application-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './application-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationModalComponent {
  public job: Jobs = this.data.job;

  public isLoading = signal(false);

  public statusForm = new FormControl<string | null>(
    this.job.application?.status ?? null,
  );

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { job: Jobs },
    private readonly dashboardService: DashboardService,
    private readonly alertService: AlertService,
  ) {
    this.statusForm.valueChanges
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe(async (value) => {
        if (!value) {
          return;
        }

        this.isLoading.set(true);
        this.statusForm.disable();

        await this.dashboardService
          .applyOrUpdateJobApplication(this.job, value)
          .finally(() => {
            this.statusForm.enable();
          });

        this.alertService.showSuccess(
          `Application status updated successfully to ${value}`,
        );
      });
  }
}
