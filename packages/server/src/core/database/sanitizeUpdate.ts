import { NOT_MODIFIED_SIGNAL } from '../../constants.js';
import { JobHubError } from '../error/JobHubError.js';
import { JobHubErrorCodes } from '../error/codes.js';

export function sanitizeUpdate<T extends Record<string, unknown | typeof NOT_MODIFIED_SIGNAL>>(
  object: T,
): Partial<{
  [P in keyof T]: Exclude<T[P], symbol | typeof NOT_MODIFIED_SIGNAL>;
}> {
  if (Object.keys(object).length === 0) {
    throw new JobHubError('No fields to update', JobHubErrorCodes.NoFieldsToUpdate);
  }

  const sanitized: Partial<T> = {};
  for (const [key, value] of Object.entries(object)) {
    if (value !== NOT_MODIFIED_SIGNAL) {
      Reflect.set(sanitized, key, value);
    }
  }

  return sanitized as Partial<{
    [P in keyof T]: Exclude<T[P], symbol | typeof NOT_MODIFIED_SIGNAL>;
  }>;
}
