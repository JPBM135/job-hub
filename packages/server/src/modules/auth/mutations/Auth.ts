import bcrypt from 'bcrypt';
import type { Users } from '../../../@types/db.schema.js';
import { JobHubError } from '../../../core/error/JobHubError.js';
import { JobHubErrorCodes } from '../../../core/error/codes.js';
import { checkState } from '../../../core/state/checkState.js';
import type { JobHubResolver } from '../../interfaces.js';
import { handleTokenGeneration } from '../common/handleTokenGeneration.js';

interface AuthInput {
  input: {
    email: string;
    nonce: string;
    password: string;
  };
}

interface AuthResponse {
  token: string;
  user: Users;
}

export const Auth: JobHubResolver<AuthResponse, AuthInput> = async (
  _,
  { input: { email, nonce, password } },
  { db },
) => {
  if (!nonce) {
    throw new JobHubError('Invalid state', JobHubErrorCodes.InvalidState);
  }

  const valid = checkState(nonce);
  if (!valid) {
    throw new JobHubError('Invalid state', JobHubErrorCodes.InvalidState);
  }

  const user = await db.select('*').from('users').where('email', email).first();

  if (!user) {
    throw new JobHubError('Invalid email or password', JobHubErrorCodes.InvalidEmailOrPassword);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new JobHubError('Invalid email or password', JobHubErrorCodes.InvalidEmailOrPassword);
  }

  return handleTokenGeneration(user);
};
