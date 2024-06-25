/* eslint-disable promise/prefer-await-to-callbacks */

/**
 * @type { import("knex").Knex.Config }
 */
export default {
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    database: 'jobhub',
    user: 'postgres',
    password: 'test',
    port: 5_432,
  },
  pool: {
    min: 1,
    max: 2,
  },
  migrations: {
    tableName: 'knex_migrations',
    loadExtensions: ['.mjs'],
  },
  seeds: {
    directory: './dist-seeds',
  },
};
