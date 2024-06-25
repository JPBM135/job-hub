import { gql } from '@apollo/client/core';
import type { Jobs, JobsApplications } from '../../../@types/Jobs';
import type { Paginated } from '../../../@types/utils';

export const GET_JOBS_QUERY = gql`
  query Jobs($where: JobWhereInput, $orderBy: JobOrderByInput, $limit: Int, $offset: Int) {
    Jobs(where: $where, orderBy: $orderBy, limit: $limit, offset: $offset) {
      data {
        id
        experienceLevel
        description
        datePosted
        createdBy {
          id
          name
        }
        location
        payMax
        payMin
        payType
        remoteStatus
        title
        type
        updatedAt
        url
        createdAt
        company
        archived
        application {
          id
          status
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        count
      }
    }
  }
`;

export interface GetJobsQueryResult {
  Jobs: Paginated<Jobs>;
}

export const APPLY_OR_UPDATE_JOB_APPLICATION_MUTATION = gql`
  mutation ApplyOrUpdateApplicationJob($input: JobApplicationInput!) {
    ApplyOrUpdateApplicationJob(input: $input) {
      id
      status
    }
  }
`;

export interface ApplyOrUpdateApplicationJobMutationResult {
  ApplyOrUpdateApplicationJob: JobsApplications;
}

export interface ApplyOrUpdateApplicationJobMutationVariables {
  input: {
    jobId: string;
    status: string;
  };
}

export const GET_JOBS_APPLICATIONS_QUERY = gql`
  query JobApplications($jobId: String!) {
    JobApplications(jobId: $jobId) {
      id
      status
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export interface GetJobApplicationsQueryResult {
  JobApplications: JobsApplications[];
}
