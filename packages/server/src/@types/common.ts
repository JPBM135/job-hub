import type { Transaction } from '@sentry/node';
import type express from 'express';
import type { Knex } from 'knex';
import type { Users } from './db.schema.js';

export interface AppContext {
  authenticatedUser: Users | null;
  db: Knex;
  req: express.Request;
  res: express.Response;
  transaction: Transaction;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageInfo: {
    count: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
