import { describe, it, expect } from 'vitest';
import { NOT_MODIFIED_SIGNAL } from '../../constants.js';
import { sanitizeUpdate } from './sanitizeUpdate.js';

describe('sanitizeUpdate', () => {
  it('should return an empty object when given an empty object', () => {
    const input = {};

    const output = sanitizeUpdate(input);

    expect(output).toEqual({});
  });

  it('should remove properties with the NOT_MODIFIED_SIGNAL value', () => {
    const input = {
      name: 'John',
      age: NOT_MODIFIED_SIGNAL,
      email: 'john@example.com',
    };

    const output = sanitizeUpdate(input);

    expect(output).toEqual({
      name: 'John',
      email: 'john@example.com',
    });
  });

  it('should not modify the original object', () => {
    const input = {
      name: 'John',
      age: NOT_MODIFIED_SIGNAL,
      email: 'john@example.com',
    };

    sanitizeUpdate(input);

    expect(input).toEqual({
      name: 'John',
      age: NOT_MODIFIED_SIGNAL,
      email: 'john@example.com',
    });
  });
});
