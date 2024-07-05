import fs from 'node:fs';
import process from 'node:process';
import { URL } from 'node:url';

interface EnvHelper<T extends Record<string, unknown>> {
  dev: T;
  prod: T;
}

type Env = EnvHelper<{
  CLIENT_URL: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_SSL: boolean;
  DB_USER: string;
  PORT: number;
  SECRET_LOGIN_HMAC: string;
  SECRET_STATE_HMAC: string;
  SENTRY_DSN: string | null;
}>;

const env = JSON.parse(
  fs.readFileSync(new URL('../env.json', import.meta.url), 'utf8'),
) as Env;

const { ENVIRONMENT } = process.env as {
  ENVIRONMENT?: 'dev' | 'prod';
};

if (ENVIRONMENT === 'prod') {
  for (const key of Object.keys(env.dev)) {
    if (
      process.env[key] === undefined &&
      env.prod[key as keyof Env['prod']] === undefined
    ) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    Reflect.set(env.prod, key, process.env[key]);
  }
}

const nodeEnv = ENVIRONMENT === 'prod' ? 'prod' : 'dev';

const envConfig = env[nodeEnv];

export const config = {
  port: envConfig.PORT,
  environment: nodeEnv,
  sentryDSN: envConfig.SENTRY_DSN,
  isProduction: ENVIRONMENT === 'prod',
  clientURL: envConfig.CLIENT_URL,
  secret: {
    loginHmac: envConfig.SECRET_LOGIN_HMAC,
    stateHmac: envConfig.SECRET_STATE_HMAC,
  },
  db: {
    name: envConfig.DB_NAME,
    password: envConfig.DB_PASSWORD,
    port: envConfig.DB_PORT,
    host: envConfig.DB_HOST,
    user: envConfig.DB_USER,
    ssl: envConfig.DB_SSL,
  },
};
