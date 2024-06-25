import process from 'node:process';
import * as Sentry from '@sentry/node';
import { config } from '../../config.js';

Sentry.init({
  dsn: config.sentryDSN ?? undefined,
  enabled: config.isProduction,
  environment: config.environment,
  ignoreErrors: [/You must be signed in to view this resource/],
  debug: process.argv.includes('--debug'),
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Apollo(),
    new Sentry.Integrations.GraphQL(),
    new Sentry.Integrations.Postgres(),
  ],
  tracesSampleRate: 0.01,
});

export * as Sentry from '@sentry/node';
