import { Buffer } from 'node:buffer';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { config } from '../../config.js';
import { MAX_STATE_AGE } from '../../constants.js';

export function checkState(state: string): boolean {
  const [encodedData, hmac] = state.split('.') as [string, string];

  if (!encodedData || !hmac) return false;

  const data = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));

  if (!data.created) return false;

  const now = Date.now();
  if (now - data.created > MAX_STATE_AGE) return false;

  const expectedHmac = createHmac('sha512', config.secret.stateHmac)
    .update(encodedData)
    .digest('hex');

  if (hmac.length !== expectedHmac.length) return false;

  return timingSafeEqual(
    Buffer.from(hmac, 'hex'),
    Buffer.from(expectedHmac, 'hex'),
  );
}
