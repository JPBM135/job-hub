import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Jobs } from '../../../../@types/Jobs';
import { TooltipWhenTruncatedDirective } from '../../../../core/directives/tooltipWhenTruncated/tooltip-when-truncated.directive';
import { CapitalizePipe } from '../../../../core/pipes/capitalize.pipe';
import { ApplicationModalComponent } from '../application-modal/application-modal.component';
import { JobApplicantsModalComponent } from '../job-applicants-modal/job-applicants-modal.component';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    TooltipWhenTruncatedDirective,
    CapitalizePipe,
  ],
  templateUrl: './job-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCardComponent {
  @Input({
    required: true,
  })
  public job!: Jobs;

  public constructor(private readonly matDialog: MatDialog) {}

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
