import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { config } from '../../config.js';
import { MAX_STATE_AGE } from '../../constants.js';
import { checkState } from './checkState.js';
import { generateState } from './generateState.js';

describe.skip('checkState', () => {
  it('should return false for an invalid state string', () => {
    const result = checkState('invalid');

    expect(result).toBe(false);
  });

  it('should return false for a state string with an invalid hmac', () => {
    const data = { created: Date.now() };
    const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');

    const hmac = 'invalid';
    const state = `${encodedData}.${hmac}`;

    const result = checkState(state);

    expect(result).toBe(false);
  });

  it('should return false for a state string with an expired timestamp', () => {
    const data = { created: Date.now() - MAX_STATE_AGE * 2 };
    const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');

    const hmac = createHmac('sha512', config.secret.stateHmac)
      .update(encodedData)
      .digest('hex');
    const state = `${encodedData}.${hmac}`;

    const result = checkState(state);

    expect(result).toBe(false);
  });

  it('should return true for a valid state string', () => {
    const data = { created: Date.now() };
    const stringified = JSON.stringify(data);
    const encodedData = Buffer.from(stringified).toString('base64');

    const hmac = createHmac('sha512', config.secret.stateHmac)
      .update(encodedData)
      .digest('hex');
    const state = `${encodedData}.${hmac}`;

    const result = checkState(state);

    expect(result).toBe(true);
  });

  it('should return true for a recent generated state string', () => {
    const state = generateState();

    const result = checkState(state);

    expect(result).toBe(true);
  });
});
