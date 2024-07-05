import type { Knex } from 'knex';
import type { PaginatedResponse } from '../../../@types/common.js';
import type { Jobs as DbJobs, Users } from '../../../@types/db.schema.js';
import { getCountFromQuery } from '../../../core/database/utils.js';
import { resolveOrderBy } from '../../../core/utils/resolveOrderBy.js';
import { resolvePagination } from '../../../core/utils/resolvePagination.js';
import type { JobHubResolver } from '../../interfaces.js';

interface JobsQueryVariables {
  limit?: number;
  offset?: number;
  orderBy?: string;
  where?: {
    applicationStatus?: string;
    archived?: boolean;
    nameContains?: string;
  };
}

async function applyWhere<T extends Knex.QueryBuilder<any, any>>(
  query: T,
  where: JobsQueryVariables['where'],
  authenticatedUser: Users,
) {
  if (!where) {
    return;
  }

  if (where.applicationStatus) {
    void query
      .where('jobs_applications.user_id', authenticatedUser.id)
      .where('jobs_applications.status', where.applicationStatus);
  }

  if (where.nameContains) {
    void query.where('jobs.title', 'ilike', `%${where.nameContains}%`);
  }

  if (typeof where.archived === 'boolean') {
    void query.where('jobs.archived', where.archived);
  }
}

async function applyJoin<T extends Knex.QueryBuilder<any, any>>(
  query: T,
  where: JobsQueryVariables['where'],
) {
  if (where?.applicationStatus) {
    void query.leftJoin(
      'jobs_applications',
      'jobs_applications.job_id',
      'jobs.id',
    );
  }
}

export const Jobs: JobHubResolver<
  PaginatedResponse<DbJobs>,
  JobsQueryVariables,
  true
> = async (
  _,
  { limit = 10, offset = 0, orderBy = 'createdAt_DESC', where = {} },
  { db, authenticatedUser },
) => {
  const query = db('jobs').select('jobs.*');

  void applyJoin(query, where);
  void applyWhere(query, where, authenticatedUser);

  const { column, order } = resolveOrderBy(orderBy, 'createdAt_DESC', {
    createdAt: 'created_at',
    title: 'title',
  });

  void query.orderBy([{ column, order }]);

  const count = await getCountFromQuery(query);
  const data = await query.limit(limit).offset(offset);

  return {
    data,
    pageInfo: resolvePagination({ count, limit, offset }),
  };
};
