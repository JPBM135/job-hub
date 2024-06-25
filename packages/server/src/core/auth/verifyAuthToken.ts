import { Buffer } from 'node:buffer';
import { createHmac, timingSafeEqual } from 'node:crypto';
import dayjs from 'dayjs';
import { config } from '../../config.js';
import { Sentry } from '../sentry/sentry.js';

type VerifyAuthTokenResult<T> =
  | {
      data: null;
      valid: false;
    }
  | {
      data: T;
      valid: true;
    };

export function verifyAuthToken<T>(token: string): VerifyAuthTokenResult<T> {
  try {
    const noBearer = token.replace('Bearer ', '');

    const [encodedHeader, encodedUser, hmac] = noBearer.split('.') as [string, string, string];

    if (!encodedHeader || !encodedUser || !hmac) return { data: null, valid: false };

    const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8')) as {
      alg: string;
      typ: string;
    };
    if (!header.alg || !header.typ) return { data: null, valid: false };

    const data = JSON.parse(Buffer.from(encodedUser, 'base64url').toString('utf8')) as {
      data: T;
      exp: number;
      iat: number;
      iss: string;
    };

    if (!data.data || !data.exp || !data.iat || !data.iss) return { data: null, valid: false };
    if (data.iss !== 'jobhub') return { data: null, valid: false };
    if (dayjs(data.exp * 1_000).isBefore(dayjs())) return { data: null, valid: false };
    if (dayjs(data.iat * 1_000).isAfter(dayjs())) return { data: null, valid: false };

    const expectedHmac = createHmac('sha512', config.secret.loginHmac)
      .update([encodedHeader, encodedUser].join('.'))
      .digest('base64url');

    if (hmac.length !== expectedHmac.length) return { data: null, valid: false };

    const isValid = timingSafeEqual(Buffer.from(hmac, 'base64url'), Buffer.from(expectedHmac, 'base64url'));

    return isValid ? { data: data.data, valid: true } : { data: null, valid: false };
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        token,
      },
    });
    return { data: null, valid: false };
  }
}
