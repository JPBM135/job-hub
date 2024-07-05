import type { Jobs } from '../../../@types/db.schema.js';
import { JobHubError } from '../../../core/error/JobHubError.js';
import { JobHubErrorCodes } from '../../../core/error/codes.js';
import type { JobHubResolver } from '../../interfaces.js';

export const Job: JobHubResolver<Jobs, { id: string }, true> = async (
  _,
  { id },
  { db },
) => {
  const [job] = await db('jobs').select('*').where('id', id);

  if (!job) {
    throw new JobHubError('Job not found', JobHubErrorCodes.JobNotFound);
  }

  return job;
};
