import type {
  JobsApplications,
  job_application_status,
} from '../../../@types/db.schema.js';
import { JobHubError } from '../../../core/error/JobHubError.js';
import { JobHubErrorCodes } from '../../../core/error/codes.js';
import type { JobHubResolver } from '../../interfaces.js';

interface JobApplicationInput {
  input: {
    jobId: string;
    status: job_application_status;
  };
}

export const ApplyOrUpdateApplicationJob: JobHubResolver<
  JobsApplications,
  JobApplicationInput,
  true
> = async (_, { input: { jobId, status } }, { db, authenticatedUser }) => {
  const [job] = await db('jobs').select('id').where('id', jobId);

  if (!job) {
    throw new JobHubError('Job not found', JobHubErrorCodes.JobNotFound);
  }

  const [jobApplication] = await db('jobs_applications')
    .select('*')
    .where('job_id', jobId)
    .where('user_id', authenticatedUser.id);

  if (jobApplication) {
    const [updatedJobApplication] = await db('jobs_applications')
      .update({ status, updated_at: new Date() })
      .where('job_id', jobId)
      .where('user_id', authenticatedUser.id)
      .returning('*');

    if (!updatedJobApplication) {
      throw new JobHubError(
        'Job application not updated',
        JobHubErrorCodes.InternalServerError,
      );
    }

    return updatedJobApplication;
  }

  const [newJobApplication] = await db('jobs_applications')
    .insert({
      job_id: jobId,
      user_id: authenticatedUser.id,
      status,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  if (!newJobApplication) {
    throw new JobHubError(
      'Job application not created',
      JobHubErrorCodes.InternalServerError,
    );
  }

  return newJobApplication;
};
