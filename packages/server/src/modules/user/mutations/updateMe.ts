import bcrypt from 'bcrypt';
import type { Users } from '../../../@types/db.schema.js';
import { BCRYPT_SALT_ROUNDS, NOT_MODIFIED_SIGNAL } from '../../../constants.js';
import { sanitizeUpdate } from '../../../core/database/sanitizeUpdate.js';
import { JobHubError } from '../../../core/error/JobHubError.js';
import { JobHubErrorCodes } from '../../../core/error/codes.js';
import { handleTokenGeneration } from '../../auth/common/handleTokenGeneration.js';
import type { JobHubResolver } from '../../interfaces.js';

interface UpdateMeInput {
  input: {
    currentPassword?: string;
    email: string;
    name: string;
    newPassword?: string;
  };
}

interface UpdateMeResponse {
  token: string;
  user: Users;
}

function validateNewPassword(newPassword: string) {
  if (newPassword.length < 8) {
    throw new JobHubError(
      'Password must be at least 8 characters',
      JobHubErrorCodes.InvalidPassword,
    );
  }

  if (newPassword.length > 255) {
    throw new JobHubError(
      'Password must be at most 255 characters',
      JobHubErrorCodes.InvalidPassword,
    );
  }

  if (!/[a-z]/.test(newPassword)) {
    throw new JobHubError(
      'Password must contain at least one lowercase letter',
      JobHubErrorCodes.InvalidPassword,
    );
  }

  if (!/[A-Z]/.test(newPassword)) {
    throw new JobHubError(
      'Password must contain at least one uppercase letter',
      JobHubErrorCodes.InvalidPassword,
    );
  }

  if (!/\d/.test(newPassword)) {
    throw new JobHubError(
      'Password must contain at least one digit',
      JobHubErrorCodes.InvalidPassword,
    );
  }

  if (!/[^\dA-Za-z]/.test(newPassword)) {
    throw new JobHubError(
      'Password must contain at least one special character',
      JobHubErrorCodes.InvalidPassword,
    );
  }
}

export const UpdateMe: JobHubResolver<
  UpdateMeResponse,
  UpdateMeInput,
  true
> = async (
  _,
  { input: { currentPassword, email, name, newPassword } },
  { db, authenticatedUser },
) => {
  const toUpdate: {
    email: string;
    name: string;
    password: string | typeof NOT_MODIFIED_SIGNAL;
  } = {
    email,
    name,
    password: NOT_MODIFIED_SIGNAL,
  };

  if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
    throw new JobHubError(
      'Invalid password change',
      JobHubErrorCodes.InvalidPasswordChange,
    );
  }

  if (newPassword && currentPassword) {
    validateNewPassword(newPassword);

    const user = await db
      .select('*')
      .from('users')
      .where('id', authenticatedUser.id)
      .first();

    if (!user) {
      throw new JobHubError(
        'Invalid email or password',
        JobHubErrorCodes.InvalidEmailOrPassword,
      );
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      throw new JobHubError(
        'Invalid email or password',
        JobHubErrorCodes.InvalidEmailOrPassword,
      );
    }

    toUpdate.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  }

  const [updatedUser] = await db('users')
    .where('id', authenticatedUser.id)
    .update(sanitizeUpdate(toUpdate))
    .returning('*');

  if (!updatedUser) {
    throw new JobHubError(
      'Could not update user',
      JobHubErrorCodes.InternalServerError,
    );
  }

  return handleTokenGeneration(updatedUser);
};
