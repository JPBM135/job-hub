import type { Users } from '../../../@types/db.schema.js';
import { generateAuthToken } from '../../../core/auth/generateAuthToken.js';

export async function handleTokenGeneration(user: Users) {
  return {
    user,
    token: generateAuthToken(user),
  };
}
