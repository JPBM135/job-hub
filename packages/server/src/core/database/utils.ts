import type { Knex } from 'knex';

export async function getCountFromQuery<T extends Knex.QueryBuilder<any, any>>(
  query: T,
  distinct = false,
): Promise<number> {
  const clonedQuery = query.clone().clearSelect().clearOrder();

  if (distinct) {
    void clonedQuery.countDistinct('* as count');
  } else {
    void clonedQuery.count('* as count');
  }

  const count = await clonedQuery;

  return Number(count[0].count);
}
