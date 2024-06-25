import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import dayjs from 'dayjs';
import { config } from '../../config.js';
import { MAX_LOGIN_AGE } from '../../constants.js';

function stringifyAndEncode(data: unknown) {
  const stringifiedData = JSON.stringify(data);
  return Buffer.from(stringifiedData, 'utf8').toString('base64url');
}

export function generateAuthToken(data: any) {
  const header = {
    alg: 'HS512',
    typ: 'JWT',
  };

  const encodedHeader = stringifyAndEncode(header);
  const encodedUser = stringifyAndEncode({
    data,
    exp: dayjs().add(MAX_LOGIN_AGE, 'milliseconds').unix(),
    iat: dayjs().unix(),
    iss: 'jobhub',
  });

  const parts = [
    encodedHeader,
    encodedUser,
    createHmac('sha512', config.secret.loginHmac)
      .update(encodedHeader + '.' + encodedUser)
      .digest('base64url'),
  ];

  return parts.join('.');
}
