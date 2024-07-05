import type { JobsApplications } from '../../../@types/db.schema.js';
import { JobHubError } from '../../../core/error/JobHubError.js';
import { JobHubErrorCodes } from '../../../core/error/codes.js';
import type { JobHubResolver } from '../../interfaces.js';

export const JobApplications: JobHubResolver<
  JobsApplications[],
  { jobId: string },
  true
> = async (_, { jobId }, { db }) => {
  const [job] = await db('jobs').select('id').where('id', jobId);

  if (!job) {
    throw new JobHubError('Job not found', JobHubErrorCodes.JobNotFound);
  }

  return db('jobs_applications').select('*').where('job_id', jobId);
};
