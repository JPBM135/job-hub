import process from 'node:process';
import knex from 'knex';

const connectionStringMaster = 'postgres://postgres:test@127.0.0.1:5432/postgres';
const databaseName = 'jobhub';

const postgresClient = knex({
  client: 'pg',
  connection: connectionStringMaster,
});

console.log('[INFO]: Recreating database...');
await postgresClient.raw(
  `SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${databaseName}' AND pid <> pg_backend_pid();`,
);
console.log('[INFO]: Terminated connections');
await postgresClient.raw(`DROP DATABASE IF EXISTS ${databaseName};`);
console.log('[INFO]: Dropped database');
await postgresClient.raw(`CREATE DATABASE ${databaseName};`);
console.log('[INFO]: Created database');

console.log('[INFO]: Database recreated');

await postgresClient.destroy();

process.exit(0);
