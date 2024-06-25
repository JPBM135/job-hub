export enum JobHubErrorCodes {
  InternalServerError = 'common/internal-server-error',
  InvalidEmailOrPassword = 'auth/invalid-email-or-password',
  InvalidPassword = 'user/invalid-password',
  InvalidPasswordChange = 'user/invalid-password-change',
  InvalidState = 'auth/invalid-state',
  InvalidToken = 'auth/invalid-token',
  JobInvalidPayRange = 'job/invalid-pay-range',
  JobNotFound = 'job/not-found',
  NoFieldsToUpdate = 'common/no-fields-to-update',
  Unauthorized = 'auth/unauthorized',
}
