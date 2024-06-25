import { describe, it, expect } from 'vitest';
import { resolvePagination } from './resolvePagination.js';

describe('resolvePagination', () => {
  it('should indicate there is a next page when offset + limit < count', () => {
    const pageInfo = resolvePagination({ count: 100, limit: 10, offset: 0 });
    expect(pageInfo.hasNextPage).toBe(true);
  });

  it('should indicate there is no next page when offset + limit >= count', () => {
    const pageInfo = resolvePagination({ count: 10, limit: 10, offset: 0 });
    expect(pageInfo.hasNextPage).toBe(false);
  });

  it('should indicate there is a previous page when offset > 0', () => {
    const pageInfo = resolvePagination({ count: 100, limit: 10, offset: 10 });
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('should indicate there is no previous page when offset is 0', () => {
    const pageInfo = resolvePagination({ count: 100, limit: 10, offset: 0 });
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('should correctly return the count', () => {
    const count = 100;
    const pageInfo = resolvePagination({ count, limit: 10, offset: 0 });
    expect(pageInfo.count).toBe(count);
  });
});
