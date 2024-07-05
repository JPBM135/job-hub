import type { Knex } from 'knex';
import type { TableTypes } from './db.schema.js';

type SelectTableType<K extends keyof TableTypes> = TableTypes[K]['select'] & {
  [P in Exclude<
    keyof TableTypes[K]['select'],
    symbol
  > as `${K}.${P}`]: TableTypes[K]['select'][P];
};

type InsertTableType<K extends keyof TableTypes> = TableTypes[K]['input'];

type UpdateTableType<K extends keyof TableTypes> = Partial<
  Exclude<TableTypes[K]['input'], 'id'>
>;

type PgToTsTablesTypesToKnexTypes = {
  [K in keyof TableTypes]: Knex.CompositeTableType<
    SelectTableType<K>,
    InsertTableType<K>,
    UpdateTableType<K>
  >;
};

declare module 'knex/types/tables.js' {
  interface Tables extends PgToTsTablesTypesToKnexTypes {}
}
