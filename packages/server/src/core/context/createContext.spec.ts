import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { describe, it, expect, afterEach, vitest } from 'vitest';
import { REALLY_LONG_LIVED_TOKEN } from '../../../tests/.helpers/constants.js';
import type { AppContext } from '../../@types/index.js';
import { createContext } from './createContext.js';

vitest.mock('../database/createDatabase.js', () => ({
  createDatabase: () => ({
    db: {
      transaction: vitest.fn(() => null),
    },
    eyeOfSauron: {},
  }),
}));

vitest.mock('../sentry/sentry.js', () => ({
  Sentry: {
    startTransaction: vitest.fn(() => {
      return {
        data: {
          'sentry.op': 'graphql',
          'sentry.origin': 'manual',
          'sentry.sample_rate': 0.01,
        },
        description: 'GraphQL Request',
        op: 'graphql',
        origin: 'manual',
      };
    }),
    setUser: vitest.fn(() => null),
    setContext: vitest.fn(() => null),
  },
}));

describe('createContext', () => {
  afterEach(() => {
    vitest.restoreAllMocks();
  });

  it('should return a context for an non authenticated user', async () => {
    const req = {
      header: vitest.fn(() => null),
      headers: {
        'x-forwarded-for': '0.0.0.0',
      },
    } as unknown as ExpressContextFunctionArgument['req'];
    const res = {} as unknown as ExpressContextFunctionArgument['res'];

    const context = await createContext({ req, res } as unknown as ExpressContextFunctionArgument);

    expect(context).toMatchObject<AppContext>({
      authenticatedUser: null,
      db: null as unknown as AppContext['db'],
      req,
      res,
      transaction: {
        data: {
          'sentry.op': 'graphql',
          'sentry.origin': 'manual',
          'sentry.sample_rate': 0.01,
        },
        description: 'GraphQL Request',
        op: 'graphql',
        origin: 'manual',
      } as unknown as AppContext['transaction'],
    });
  });

  it('should return a context for an authenticated user', async () => {
    const req = {
      header: vitest.fn(() => REALLY_LONG_LIVED_TOKEN),
      headers: {
        'x-forwarded-for': '0.0.0.0',
      },
    } as unknown as ExpressContextFunctionArgument['req'];
    const res = {} as unknown as ExpressContextFunctionArgument['res'];

    const context = await createContext({ req, res } as unknown as ExpressContextFunctionArgument);

    expect(context).toMatchObject<AppContext>({
      authenticatedUser: {
        id: '150e06fb-7b2b-473f-a5fa-4e5c6d67203e',
        created_at: new Date('2021-08-26T00:00:00.000Z'),
        email: 'test@gmail.com',
        name: 'Test User',
        password: 'password',
        updated_at: new Date('2021-08-26T00:00:00.000Z'),
      },
      db: null as unknown as AppContext['db'],
      req,
      res,
      transaction: {
        data: {
          'sentry.op': 'graphql',
          'sentry.origin': 'manual',
          'sentry.sample_rate': 0.01,
        },
        description: 'GraphQL Request',
        op: 'graphql',
        origin: 'manual',
      } as unknown as AppContext['transaction'],
    });
  });
});
