import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import type { Users } from '../../@types/db.schema.js';
import type { AppContext } from '../../@types/index.js';
import { verifyAuthToken } from '../auth/verifyAuthToken.js';
import { createDatabase } from '../database/createDatabase.js';
import { Sentry } from '../sentry/sentry.js';

function resolveIp(req: ExpressContextFunctionArgument['req']) {
  if (req.headers['x-forwarded-for']) {
    return Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'];
  }

  return req.socket?.remoteAddress ?? req.ip;
}

export async function createContext({ req, res }: ExpressContextFunctionArgument): Promise<AppContext> {
  try {
    const { db } = await createDatabase();
    const transaction = Sentry.startTransaction({
      op: 'graphql',
      name: 'GraphQL Request',
    });
    const authorization = req.header('authorization');
    console.log('authorization', authorization);
    const tokenResult = authorization ? verifyAuthToken<Users>(authorization) : null;

    const ip = resolveIp(req);

    if (tokenResult?.valid) {
      const user = tokenResult.data;

      Sentry.setUser({
        id: user.id,
        email: user.email,
        ip_address: ip,
        username: user.name,
      });
    }

    Sentry.setContext('request', {
      headers: req.headers,
      method: req.method,
      url: req.url,
    });

    return {
      req,
      res,
      transaction,
      db,
      authenticatedUser: tokenResult?.valid ? tokenResult.data : null,
    };
  } catch (error) {
    console.error('[ERROR] createContext', error);
    Sentry.captureException(error);
    throw error;
  }
}
