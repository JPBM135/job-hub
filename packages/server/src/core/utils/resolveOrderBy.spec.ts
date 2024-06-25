import { describe, it, expect } from 'vitest';
import { resolveOrderBy } from './resolveOrderBy.js';

describe('resolveOrderBy', () => {
  it('should resolve to the specified order when valid', () => {
    const orderBy = 'name_DESC';
    const defaultOrderBy = 'age_ASC';
    const allowedOrderBy = { name: 'name', age: 'age' };
    const result = resolveOrderBy(orderBy, defaultOrderBy, allowedOrderBy);
    expect(result).toEqual({ column: 'name', order: 'DESC' });
  });

  it('should fall back to default order when orderBy is not allowed', () => {
    const orderBy = 'height_DESC';
    const defaultOrderBy = 'age_ASC';
    const allowedOrderBy = { name: 'name', age: 'age' };
    const result = resolveOrderBy(orderBy, defaultOrderBy, allowedOrderBy);
    expect(result).toEqual({ column: 'age', order: 'ASC' });
  });

  it('should default to ASC when order part is invalid', () => {
    const orderBy = 'name_WRONG';
    const defaultOrderBy = 'age_ASC';
    const allowedOrderBy = { name: 'name', age: 'age' };
    const result = resolveOrderBy(orderBy, defaultOrderBy, allowedOrderBy);
    expect(result).toEqual({ column: 'name', order: 'ASC' });
  });

  it('should use default order when orderBy is empty', () => {
    const orderBy = '';
    const defaultOrderBy = 'age_ASC';
    const allowedOrderBy = { name: 'name', age: 'age' };
    const result = resolveOrderBy(orderBy, defaultOrderBy, allowedOrderBy);
    expect(result).toEqual({ column: 'age', order: 'ASC' });
  });
});
