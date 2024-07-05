import type {
  Jobs as DbJobs,
  JobsApplications,
} from '../../@types/db.schema.js';
import { dateResolver } from '../../core/utils/dateResolver.js';
import type { JobHubResolverMap, JobHubUnitResolver } from '../interfaces.js';
import type { GraphQlJob, GraphQlJobApplication } from './interfaces.js';
import { ApplyOrUpdateApplicationJob } from './mutations/applyOrUpdateApplicationJob.js';
import { ArchiveOrUnarchiveJob } from './mutations/archiveOrUnarchiveJob.js';
import { CreateJob } from './mutations/createJob.js';
import { UpdateJob } from './mutations/updateJob.js';
import { Job } from './queries/job.js';
import { JobApplications } from './queries/jobApplications.js';
import { Jobs } from './queries/jobs.js';

interface UnitResolvers {
  Job: JobHubUnitResolver<DbJobs, GraphQlJob, true>;
  JobApplication: JobHubUnitResolver<
    JobsApplications,
    GraphQlJobApplication,
    true
  >;
}

type JobResolvers = JobHubResolverMap<
  {
    Job: typeof Job;
    JobApplications: typeof JobApplications;
    Jobs: typeof Jobs;
  },
  {
    ApplyOrUpdateApplicationJob: typeof ApplyOrUpdateApplicationJob;
    ArchiveOrUnarchiveJob: typeof ArchiveOrUnarchiveJob;
    CreateJob: typeof CreateJob;
    UpdateJob: typeof UpdateJob;
  },
  UnitResolvers
>;

export const resolvers: JobResolvers = {
  Query: {
    Job,
    Jobs,
    JobApplications,
  },
  Mutation: {
    ArchiveOrUnarchiveJob,
    ApplyOrUpdateApplicationJob,
    CreateJob,
    UpdateJob,
  },
  Job: {
    datePosted: (_) => dateResolver(_.date_posted, true),
    experienceLevel: (_) => _.experience_level,
    payMax: (_) => _.pay_max,
    payMin: (_) => _.pay_min,
    payType: (_) => _.pay_type,
    remoteStatus: (_) => _.remote_status,
    createdAt: (_) => dateResolver(_.created_at),
    application: async (_, __, { db, authenticatedUser }) => {
      const application = await db('jobs_applications')
        .select('*')
        .where({
          job_id: _.id,
          user_id: authenticatedUser.id,
        })
        .first();

      return application ?? null;
    },
    createdBy: async (_, __, { db }) => {
      const user = await db('users').where('id', _.created_by).first();
      return user!;
    },
    updatedAt: (_) => dateResolver(_.updated_at),
  },
  JobApplication: {
    job: async (_, __, { db }) => {
      const job = await db('jobs').where('id', _.job_id).first();
      return job! as DbJobs;
    },
    user: async (_, __, { db }) => {
      const user = await db('users').where('id', _.user_id).first();
      return user!;
    },
    createdAt: (_) => dateResolver(_.created_at),
    updatedAt: (_) => dateResolver(_.updated_at),
  },
};
