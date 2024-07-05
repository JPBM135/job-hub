import type {
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContextWillSendResponse,
} from '@apollo/server';
import type { Knex } from 'knex';
import { describe, it, expect, vitest } from 'vitest';
import type { AppContext } from '../../@types/index.js';
import DisconnectDatabasePlugin from './cleanDatabasePlugin.js';

describe('DisconnectDatabasePlugin', () => {
  it('should call commit and destroy on willSendResponse', async () => {
    const db = {
      commit: vitest.fn(),
      rollback: vitest.fn(),
    } as unknown as Knex.Transaction;
    const rawDb = {
      destroy: vitest.fn(),
    } as unknown as Knex;
    const plugin = DisconnectDatabasePlugin();
    const requestLifecycle = (await plugin.requestDidStart!(null as any))!;
    await requestLifecycle.willSendResponse!({
      contextValue: { db, rawDb },
    } as unknown as GraphQLRequestContextWillSendResponse<AppContext>);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(db.commit).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(rawDb.destroy).toHaveBeenCalled();
  });

  it('should call rollback and destroy on didEncounterErrors', async () => {
    const db = {
      commit: vitest.fn(),
      rollback: vitest.fn(),
    };
    const rawDb = {
      destroy: vitest.fn(),
    };
    const plugin = DisconnectDatabasePlugin();
    const requestLifecycle = (await plugin.requestDidStart!(null as any))!;
    await requestLifecycle.didEncounterErrors!({
      contextValue: { db, rawDb },
    } as unknown as GraphQLRequestContextDidEncounterErrors<AppContext>);

    expect(db.rollback).toHaveBeenCalled();
    expect(rawDb.destroy).toHaveBeenCalled();
  });
});
