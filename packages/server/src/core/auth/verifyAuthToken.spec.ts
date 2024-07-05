import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { REALLY_LONG_LIVED_TOKEN } from '../../../tests/.helpers/constants.js';
import type { Users } from '../../@types/db.schema.js';
import { config } from '../../config.js';
import { MAX_LOGIN_AGE } from '../../constants.js';
import { generateAuthToken } from './generateAuthToken.js';
import { verifyAuthToken } from './verifyAuthToken.js';

const user: Users = {
  id: '648f1c77-7eeb-4930-82c1-018bd1f4f0d8',
  email: 'test@email.com',
  name: 'Test User',
  password: 'password',
  created_at: new Date('2023-07-02T23:01:31.110Z'),
  updated_at: new Date('2023-07-02T23:01:31.110Z'),
};

describe('verifyAuthToken', () => {
  it('should return false for an invalid authToken string', () => {
    const result = verifyAuthToken('invalid');

    expect(result).toEqual({
      valid: false,
      data: null,
    });
  });

  it('should return false for a authToken string with an invalid hmac', () => {
    const data = { created: Date.now() };
    const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');
    const encodedUser = Buffer.from(JSON.stringify(user)).toString('base64url');

    const hmac = 'invalid';
    const authToken = `${encodedData}.${encodedUser}.${hmac}`;

    const result = verifyAuthToken(authToken);

    expect(result).toEqual({
      valid: false,
      data: null,
    });
  });

  it('should return false for a authToken string with an invalid user', () => {
    const data = { created: Date.now() };
    const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');
    const encodedUser = Buffer.from(JSON.stringify({})).toString('base64url');

    const hmac = createHmac('sha512', config.secret.loginHmac)
      .update(encodedData + '.' + encodedUser)
      .digest('base64url');
    const authToken = `${encodedData}.${encodedUser}.${hmac}`;

    const result = verifyAuthToken(authToken);

    expect(result).toEqual({
      valid: false,
      data: null,
    });
  });

  it('should return false for a authToken string with an expired timestamp', () => {
    const data = { created: Date.now() - MAX_LOGIN_AGE * 2 };
    const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');

    const hmac = createHmac('sha512', config.secret.loginHmac)
      .update(encodedData)
      .digest('base64url');
    const authToken = `${encodedData}.${hmac}`;

    const result = verifyAuthToken(authToken);

    expect(result).toEqual({
      valid: false,
      data: null,
    });
  });

  it('should return true for a valid authToken string', () => {
    const header = { alg: 'HS512', typ: 'JWT' };
    const stringified = JSON.stringify(header);
    const encodedData = Buffer.from(stringified).toString('base64url');
    const encodedUser = Buffer.from(
      JSON.stringify({
        data: user,
        exp: dayjs().add(1, 'day').unix(),
        iat: Date.now(),
        iss: 'jobhub',
      }),
    ).toString('base64url');

    const hmac = createHmac('sha512', config.secret.loginHmac)
      .update(encodedData + '.' + encodedUser)
      .digest('base64url');
    const authToken = `${encodedData}.${encodedUser}.${hmac}`;

    const result = verifyAuthToken(authToken);

    expect(result).toEqual({
      valid: true,
      data: user,
    });
  });

  it('should return true for a recent generated authToken string', () => {
    const token = generateAuthToken(user);

    const result = verifyAuthToken(token);

    expect(result).toEqual({
      valid: true,
      data: user,
    });
  });

  it('given the tests hard coded token, should return true', () => {
    const result = verifyAuthToken(REALLY_LONG_LIVED_TOKEN);

    expect(result).toEqual({
      valid: true,
      data: expect.any(Object),
    });
  });

  it('given an tempered encodedData, should return false', () => {
    const [encodedData, encodedUser, hmac] = REALLY_LONG_LIVED_TOKEN.split(
      '.',
    ) as [string, string, string];

    const data = JSON.parse(
      Buffer.from(encodedData, 'base64url').toString('utf8'),
    );
    const stringifiedData = JSON.stringify({
      ...data,
      created: data.created - 1_000,
    });
    const temperedEncodedData = Buffer.from(stringifiedData, 'utf8').toString(
      'base64url',
    );

    const authToken = `${temperedEncodedData}.${encodedUser}.${hmac}`;

    const result = verifyAuthToken(authToken);

    expect(result).toEqual({
      valid: false,
      data: null,
    });
  });

  it('given an tempered encodedUser, should return false', () => {
    const [encodedData, encodedUser, hmac] = REALLY_LONG_LIVED_TOKEN.split(
      '.',
    ) as [string, string, string];

    const user = JSON.parse(
      Buffer.from(encodedUser, 'base64url').toString('utf8'),
    );
    const stringifiedUser = JSON.stringify({
      ...user,
      id: '00000000-0000-0000-0000-000000000000',
    });
    const temperedEncodedUser = Buffer.from(stringifiedUser, 'utf8').toString(
      'base64url',
    );

    const authToken = `${encodedData}.${temperedEncodedUser}.${hmac}`;

    const result = verifyAuthToken(authToken);

    expect(result).toEqual({
      valid: false,
      data: null,
    });
  });
});
