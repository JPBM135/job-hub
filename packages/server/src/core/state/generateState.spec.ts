import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { config } from '../../config.js';
import { generateState } from './generateState.js';

describe('generateState', () => {
  it('should generate a state string', () => {
    const state = generateState();

    expect(typeof state).toBe('string');

    expect(state).toMatch(
      // eslint-disable-next-line unicorn/no-unsafe-regex
      /^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{2}==|[\d+/A-Za-z]{3}=)?\.[\da-f]+$/,
    );
  });

  it('should generate a state string with a valid hmac', () => {
    const state = generateState();
    const [encodedData, hmac] = state.split('.') as [string, string];

    const expectedHmac = createHmac('sha512', config.secret.stateHmac)
      .update(encodedData)
      .digest('hex');

    expect(hmac).toBe(expectedHmac);
  });

  it('should generate a state string with a created timestamp', () => {
    const state = generateState();
    const [encodedData] = state.split('.') as [string, string];
    const data = JSON.parse(
      Buffer.from(encodedData, 'base64').toString('utf8'),
    );

    expect(data.created).toBeDefined();
    expect(typeof data.created).toBe('number');
  });
});
