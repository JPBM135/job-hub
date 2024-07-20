import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';
import type { Jobs } from '../../../@types/Jobs';
import {
  APPLY_OR_UPDATE_JOB_APPLICATION_MUTATION,
  type ApplyOrUpdateApplicationJobMutationResult,
  GET_JOBS_QUERY,
  type GetJobsQueryResult,
  GET_JOBS_APPLICATIONS_QUERY,
  type GetJobApplicationsQueryResult,
  CREATE_JOB_MUTATION,
  type CreateJobMutationResult,
} from './jobs-api.graphql';

@Injectable({
  providedIn: 'root',
})
export class JobsApiService {
  public constructor(private readonly apollo: Apollo) {}

  public getJobs({
    where,
    orderBy,
    limit,
    offset,
  }: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    where?: {
      applicationStatus?: string;
      archived?: boolean;
      nameContains?: string;
      remoteStatus?: string;
    };
  }) {
    return this.apollo
      .query<GetJobsQueryResult>({
        query: GET_JOBS_QUERY,
        variables: {
          where,
          orderBy,
          limit,
          offset,
        },
      })
      .pipe(map((response) => response.data.Jobs));
  }

  public applyOrUpdateJobApplication(input: { jobId: string; status: string }) {
    return this.apollo
      .mutate<ApplyOrUpdateApplicationJobMutationResult>({
        mutation: APPLY_OR_UPDATE_JOB_APPLICATION_MUTATION,
        variables: {
          input,
        },
      })
      .pipe(map((response) => response.data?.ApplyOrUpdateApplicationJob));
  }

  public getJobApplicants(jobId: string) {
    return this.apollo
      .query<GetJobApplicationsQueryResult>({
        query: GET_JOBS_APPLICATIONS_QUERY,
        variables: {
          jobId,
        },
      })
      .pipe(map((response) => response.data.JobApplications));
  }

  public createJob(input: Jobs) {
    return this.apollo
      .mutate<CreateJobMutationResult>({
        mutation: CREATE_JOB_MUTATION,
        variables: {
          input,
        },
      })
      .pipe(map((response) => response.data?.CreateJob));
  }
}
