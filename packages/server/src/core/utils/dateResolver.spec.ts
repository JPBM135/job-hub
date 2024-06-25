import { describe, it, expect } from 'vitest';
import { dateResolver } from './dateResolver.js';

describe('dateResolver', () => {
  it('returns an ISO string for a valid Date object', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const result = dateResolver(date);
    expect(result).toBe('2023-01-01T00:00:00.000Z');
  });

  it('returns an ISO string for a valid date string', () => {
    const dateString = '2023-01-01T00:00:00.000Z';
    const result = dateResolver(dateString);
    expect(result).toBe('2023-01-01T00:00:00.000Z');
  });

  it('returns null when date is null and allowNull is true', () => {
    const result = dateResolver(null, true);
    expect(result).toBeNull();
  });

  it('throws an error when date is null and allowNull is false', () => {
    expect(() => dateResolver(null)).toThrow('Date is required');
  });

  it('throws an error when date is undefined', () => {
    expect(() => dateResolver(undefined)).toThrow('Date is required');
  });
});
