import type {
  Jobs,
  JobsInput,
  Users,
  job_experience_level,
  job_pay_type,
  job_remote_status,
  job_type,
} from '../../../@types/db.schema.js';
import { JobHubError } from '../../../core/error/JobHubError.js';
import { JobHubErrorCodes } from '../../../core/error/codes.js';
import type { JobHubResolver } from '../../interfaces.js';

interface JobInput {
  company?: string;
  datePosted?: string;
  description?: string;
  experienceLevel: job_experience_level;
  location?: string;
  payMax?: number;
  payMin?: number;
  payType?: job_pay_type;
  remoteStatus: job_remote_status;
  title: string;
  type: job_type;
  url: string;
}

interface CreateJobVariables {
  input: JobInput;
}

function toJobRow(input: JobInput, authenticatedUser: Users): JobsInput {
  return {
    company: input.company,
    date_posted: input.datePosted ? new Date(input.datePosted) : undefined,
    description: input.description,
    experience_level: input.experienceLevel,
    location: input.location,
    pay_max: input.payMax ?? null,
    pay_min: input.payMin ?? null,
    pay_type: input.payType ?? null,
    remote_status: input.remoteStatus,
    title: input.title,
    type: input.type,
    url: input.url,
    created_by: authenticatedUser.id,
  };
}

export const CreateJob: JobHubResolver<Jobs, CreateJobVariables, true> = async (
  _,
  { input },
  { db, authenticatedUser },
) => {
  if (input.payMax && input.payMin && input.payMax < input.payMin) {
    throw new JobHubError('Pay max must be greater than pay min', JobHubErrorCodes.JobInvalidPayRange);
  }

  const [job] = await db('jobs').insert(toJobRow(input, authenticatedUser)).returning('*');

  if (!job) {
    throw new JobHubError('Job not created', JobHubErrorCodes.InternalServerError);
  }

  return job;
};
