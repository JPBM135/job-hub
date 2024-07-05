export const ErrorCodes = {
  DEFAULTS: {
    DEFAULT: 'An error occurred. Please try again later.',
    NETWORK: 'A network error occurred. Are you connected to the internet?',
    SERVER: 'We are experiencing internal issues. Please try again later.',
  },
  USER_DEFINED: {
    'common/internal-server-error':
      'An unexpected error occurred. Please try again later.',
    'auth/invalid-email-or-password':
      'Invalid email or password. Please try again.',
    'auth/invalid-state':
      'Invalid state. Please refresh the page and try again.',
    'auth/invalid-token': 'Invalid token. Please log in again.',
    'job/invalid-pay-range': 'Invalid pay range. Please enter a valid range.',
    'job/not-found':
      'Job not found. It may have been removed or does not exist.',
    'common/no-fields-to-update':
      'No fields to update. Please make changes to at least one field.',
    'auth/unauthorized': 'Unauthorized access. Please log in to continue.',
  },
};
