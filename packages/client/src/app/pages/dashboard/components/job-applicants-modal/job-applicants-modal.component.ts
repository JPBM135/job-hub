import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import type { JobsApplications, Jobs } from '../../../../@types/Jobs';
import { JobsApiService } from '../../../../core/api/jobs/jobs-api.service';
import { CapitalizePipe } from '../../../../core/pipes/capitalize.pipe';

@Component({
  selector: 'app-job-applicants-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, CapitalizePipe],
  templateUrl: './job-applicants-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobApplicantsModalComponent {
  public job: Jobs = this.data.job;

  public jobApplicants = signal<JobsApplications[]>([]);

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { job: Jobs },
    private readonly jobsApiService: JobsApiService,
  ) {
    void this.loadJobApplicants();
  }

  public async loadJobApplicants(): Promise<void> {
    const jobApplicants = await firstValueFrom(
      this.jobsApiService.getJobApplicants(this.job.id),
    );

    this.jobApplicants.set(jobApplicants);
  }
}
