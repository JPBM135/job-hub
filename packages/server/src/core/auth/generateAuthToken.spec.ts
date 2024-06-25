import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import bcrypt from 'bcrypt';
import { describe, expect, it } from 'vitest';
import type { Users } from '../../@types/db.schema.js';
import { config } from '../../config.js';
import { generateAuthToken } from './generateAuthToken.js';

const user: Users = {
  id: '648f1c77-7eeb-4930-82c1-018bd1f4f0d8',
  email: 'test@gmail.com',
  password: bcrypt.hashSync('password', 10),
  name: 'Test',
  created_at: new Date('2023-07-02T23:01:31.110Z'),
  updated_at: new Date('2023-07-02T23:01:31.110Z'),
};

const authTokenRegex =
  // eslint-disable-next-line unicorn/no-unsafe-regex
  /^(?:(?:[\d-_/A-Za-z]{4})*(?:[\d-_/A-Za-z]{2}|[\d-_/A-Za-z]{3})?\.){2}(?:[\d-_/A-Za-z]{4})*(?:[\d-_/A-Za-z]{2}|[\d-_/A-Za-z]{3})$/;

describe('generateAuthToken', () => {
  it('should generate a state string', () => {
    const state = generateAuthToken(user);

    expect(typeof state).toBe('string');

    expect(state).toMatch(authTokenRegex);
  });

  it('should generate a state string with a valid hmac', () => {
    const state = generateAuthToken(user);
    const [encodedData, encodedUser, hmac] = state.split('.') as [string, string, string];

    const expectedHmac = createHmac('sha512', config.secret.loginHmac)
      .update(encodedData + '.' + encodedUser)
      .digest('base64url');

    expect(hmac).toBe(expectedHmac);
  });

  it('should generate a state string with a created timestamp', () => {
    const state = generateAuthToken(user);
    const [encodedData, encodedUser] = state.split('.') as [string, string];
    const data = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf8'));
    const decodedUser = JSON.parse(Buffer.from(encodedUser, 'base64url').toString('utf8')) as Users;

    expect(data.created).toBeDefined();
    expect(typeof data.created).toBe('number');
    expect(data.created).toBeLessThanOrEqual(Date.now());

    expect(decodedUser).toEqual(user);
  });
});
