import type { Knex } from 'knex';
import knex from 'knex';
import { config } from '../../config.js';

export async function createDatabase(): Promise<{ db: Knex }> {
  const knexConfig: Knex.Config = {
    client: 'postgresql',
    connection: {
      database: config.db.name,
      host: config.db.host,
      password: config.db.password,
      port: config.db.port,
      user: config.db.user,
      ssl: config.db.ssl,
    },
    migrations: {
      loadExtensions: ['.mjs'],
    },
  };

  const db = knex(knexConfig);

  await db.raw(`
    set timezone = 'utc';
  `);

  return {
    db,
  };
}

export async function createPostgresDatabase(): Promise<ReturnType<(typeof knex)['knex']>> {
  const knexConfig: Knex.Config = {
    client: 'postgresql',
    connection: {
      database: 'postgres',
      host: config.db.host,
      password: config.db.password,
      port: config.db.port,
      user: config.db.user,
      ssl: config.db.ssl,
    },
    migrations: {
      loadExtensions: ['.mjs'],
    },
  };

  const db = knex(knexConfig);

  await db.raw(`
    set timezone = 'utc';
  `);

  return db;
}
