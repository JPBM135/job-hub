import type { PaginatedResponse } from '../../@types/common.js';

export function resolvePagination({
  limit,
  offset,
  count,
}: {
  count: number;
  limit: number;
  offset: number;
}): PaginatedResponse<unknown>['pageInfo'] {
  const hasNextPage = offset + limit < count;
  const hasPreviousPage = offset > 0;

  return {
    count,
    hasNextPage,
    hasPreviousPage,
  };
}
