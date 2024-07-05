import { Buffer } from 'node:buffer';
import { describe, it, expect } from 'vitest';
import { decodeJWT } from './decodeJWT.js';

describe('decodeJWT', () => {
  it('should return the correct decoded JWT', () => {
    const jwt = [
      Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
        'base64url',
      ),
      Buffer.from(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          iat: 1_516_239_022,
        }),
      ).toString('base64url'),
      'signature',
    ];

    const result = decodeJWT(jwt.join('.'));
    expect(result).toStrictEqual({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '1234567890', name: 'John Doe', iat: 1_516_239_022 },
      signature: 'signature',
    });
  });

  it('should throw an error when the token is invalid', () => {
    expect(() => decodeJWT('invalid')).toThrow('Invalid token');
  });

  it('should throw an error when the header is an invalid JSON', () => {
    const jwt = [
      'invalid',
      Buffer.from(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          iat: 1_516_239_022,
        }),
      ).toString('base64url'),
      'signature',
    ];

    expect(() => decodeJWT(jwt.join('.'))).toThrow('Invalid token');
  });

  it('should throw an error when the payload is an invalid JSON', () => {
    const jwt = [
      Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
        'base64url',
      ),
      'invalid',
      'signature',
    ];

    expect(() => decodeJWT(jwt.join('.'))).toThrow('Invalid token');
  });
});
