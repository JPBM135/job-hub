import type {
  Jobs,
  JobsInput,
  job_experience_level,
  job_pay_type,
  job_remote_status,
  job_type,
} from '../../../@types/db.schema.js';
import type { SelectiveUpdate } from '../../../@types/utils.js';
import { NOT_MODIFIED_SIGNAL } from '../../../constants.js';
import { sanitizeUpdate } from '../../../core/database/sanitizeUpdate.js';
import { JobHubError } from '../../../core/error/JobHubError.js';
import { JobHubErrorCodes } from '../../../core/error/codes.js';
import type { JobHubResolver } from '../../interfaces.js';

interface JobUpdateInput {
  archived?: boolean;
  company?: string;
  datePosted?: string;
  description?: string;
  experienceLevel?: job_experience_level;
  location?: string;
  payMax?: number;
  payMin?: number;
  payType?: job_pay_type;
  remoteStatus?: job_remote_status;
  title?: string;
  type?: job_type;
  url?: string;
}

interface UpdateJobVariables {
  id: string;
  input: JobUpdateInput;
}

function toUpdateJobRow(
  input: JobUpdateInput,
): SelectiveUpdate<Partial<JobsInput>> {
  return {
    company: input.company,
    date_posted: input.datePosted ? new Date(input.datePosted) : null,
    description: input.description,
    experience_level: input.experienceLevel ?? NOT_MODIFIED_SIGNAL,
    location: input.location,
    pay_max: input.payMax,
    pay_min: input.payMin,
    pay_type: input.payType,
    remote_status: input.remoteStatus,
    title: input.title ?? NOT_MODIFIED_SIGNAL,
    type: input.type,
    url: input.url ?? NOT_MODIFIED_SIGNAL,
    updated_at: new Date(),
    archived: input.archived ?? NOT_MODIFIED_SIGNAL,
  };
}

export const UpdateJob: JobHubResolver<Jobs, UpdateJobVariables, true> = async (
  _,
  { id, input },
  { db },
) => {
  const [job] = await db('jobs').select('*').where('id', id);

  if (!job) {
    throw new JobHubError('Job not found', JobHubErrorCodes.JobNotFound);
  }

  const updateRow = toUpdateJobRow(input);
  const sanitizedUpdate = sanitizeUpdate(updateRow);

  const [updatedJob] = await db('jobs')
    .update(sanitizedUpdate)
    .where('id', id)
    .returning('*');

  if (!updatedJob) {
    throw new JobHubError(
      'Job not updated',
      JobHubErrorCodes.InternalServerError,
    );
  }

  return updatedJob;
};
