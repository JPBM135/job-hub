import type { JobHubResolver } from 'modules/interfaces.js';
import { generateState } from '../../../core/state/generateState.js';

// eslint-disable-next-line id-length
export const GetNonce: JobHubResolver<
  {
    nonce: string;
  },
  unknown
> = async () => {
  const nonce = generateState();

  return { nonce };
};
