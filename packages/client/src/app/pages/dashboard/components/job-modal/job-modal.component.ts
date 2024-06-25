import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import type { Jobs } from '../../../../@types/Jobs';
import { JobsApiService } from '../../../../core/api/jobs/jobs-api.service';
import { AlertService } from '../../../../core/services/alert/alert.service';

interface JobForm {
  company: FormControl<string | null>;
  datePosted: FormControl<string | null>;
  description: FormControl<string | null>;
  experienceLevel: FormControl<string | null>;
  location: FormControl<string | null>;
  payMax: FormControl<number | null>;
  payMin: FormControl<number | null>;
  payType: FormControl<string | null>;
  remoteStatus: FormControl<string | null>;
  title: FormControl<string | null>;
  type: FormControl<string | null>;
  url: FormControl<string | null>;
}

@Component({
  selector: 'app-job-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './job-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobModalComponent {
  public jobForm = new FormGroup<JobForm>({
    company: new FormControl(null, [Validators.minLength(3)]),
    datePosted: new FormControl(null),
    description: new FormControl(null, [Validators.minLength(10), Validators.maxLength(1_024)]),
    experienceLevel: new FormControl<string>('', [Validators.required]),
    location: new FormControl(null, [Validators.minLength(3), Validators.maxLength(1_024)]),
    payMax: new FormControl(null, [Validators.min(0), Validators.pattern(/^[\d,]+$/)]),
    payMin: new FormControl(null, [Validators.min(0), Validators.pattern(/^[\d,]+$/)]),
    payType: new FormControl(null),
    remoteStatus: new FormControl<string>('', [Validators.required]),
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    type: new FormControl<string>('', [Validators.required]),
    url: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/https?:\/\/.+/),
      Validators.maxLength(2_048),
    ]),
  });

  public get isEdit(): boolean {
    return Boolean(this.data?.job);
  }

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { job: Jobs } | null,
    private readonly jobsApiService: JobsApiService,
    private readonly alertService: AlertService,
  ) {
    if (this.isEdit) {
      this.jobForm.patchValue({
        company: this.data!.job.company,
        datePosted: this.data!.job.datePosted ? new Date(this.data!.job.datePosted).toISOString().split('T')[0] : null,
        description: this.data!.job.description,
        experienceLevel: this.data!.job.experienceLevel,
        location: this.data!.job.location,
        payMax: this.data!.job.payMax,
        payMin: this.data!.job.payMin,
        payType: this.data!.job.payType,
        remoteStatus: this.data!.job.remoteStatus,
        title: this.data!.job.title,
        type: this.data!.job.type,
        url: this.data!.job.url,
      });
    }
  }

  public getControl(controlName: keyof JobForm): FormControl {
    return this.jobForm.get(controlName) as FormControl;
  }

  public hasError(controlName: keyof JobForm, error: string): boolean {
    const control = this.getControl(controlName);
    return control.touched && control.hasError(error);
  }

  public async submit(): Promise<void> {
    if (this.jobForm.invalid) {
      return;
    }

    if (this.isEdit) {
      await this.editJob();
    } else {
      await this.createJob();
    }
  }

  private async createJob(): Promise<void> {
    const job = this.jobForm.value as Jobs;
    const createdJob = await firstValueFrom(this.jobsApiService.createJob(job));
    if (createdJob) {
      this.alertService.showSuccess('Job created successfully, thank you!');
    }
  }

  private async editJob(): Promise<void> {
    // const job = this.jobForm.value as Jobs;
    // const updatedJob = await this.jobsApiService.updateJob(this.data!.job.id, job);
    // if (updatedJob) {
    //   this.alertService.showSuccess('Job updated successfully');
    // }
  }
}
