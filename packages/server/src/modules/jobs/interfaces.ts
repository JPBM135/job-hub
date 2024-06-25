import type { TypedOmit, JobsApplications, Jobs, Users, TransformRecordToCamelCase } from '../../@types/index.js';

export type GraphQlJobApplication = TransformRecordToCamelCase<TypedOmit<JobsApplications, 'job_id' | 'user_id'>> & {
  job: Jobs;
  user: Users;
};

export type GraphQlJob = TransformRecordToCamelCase<TypedOmit<Jobs, 'created_by'>> & {
  application: JobsApplications | null;
  createdBy: Users;
};
