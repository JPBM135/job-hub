import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import { config } from '../../config.js';

export function generateState(): string {
  const data = {
    created: Date.now(),
  };

  const stringified = JSON.stringify(data);
  const encodedData = Buffer.from(stringified, 'utf8').toString('base64');

  const parts = [
    encodedData,
    createHmac('sha512', config.secret.stateHmac)
      .update(encodedData)
      .digest('hex'),
  ];

  return parts.join('.');
}
