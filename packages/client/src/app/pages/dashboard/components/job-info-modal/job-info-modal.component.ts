import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Jobs } from '../../../../@types/Jobs';
import { TooltipWhenTruncatedDirective } from '../../../../core/directives/tooltipWhenTruncated/tooltip-when-truncated.directive';
import { CapitalizePipe } from '../../../../core/pipes/capitalize.pipe';
import { ApplicationModalComponent } from '../application-modal/application-modal.component';
import { JobApplicantsModalComponent } from '../job-applicants-modal/job-applicants-modal.component';

@Component({
  selector: 'app-job-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    TooltipWhenTruncatedDirective,
    CapitalizePipe,
  ],
  templateUrl: './job-info-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobInfoModalComponent {
  public job: Jobs = this.data.job;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { job: Jobs },
    private readonly matDialog: MatDialog,
  ) {}

  public openJob(): void {
    window.open(this.job.url, '_blank');

    this.openApplicationModal();
  }

  public openApplicationModal(): void {
    this.matDialog.open(ApplicationModalComponent, {
      data: {
        job: this.job,
      },
    });
  }

  public openJobApplicantsModal(): void {
    this.matDialog.open(JobApplicantsModalComponent, {
      data: {
        job: this.job,
      },
    });
  }
}
