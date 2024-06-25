import type { Knex } from 'knex';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as _ from '../src/@types/knex.js';

export const seed = async (knex: Knex): Promise<void> => {
  await knex('users').insert([
    {
      name: 'João Pedro',
      email: 'jpedrobm0@gmail.com',
      password: '$2a$12$D0vzOLE65mQJX0aZK03Y3.wiBl2KYQL7NLh1S7IE/.PuMEnBqvwOG',
    },
  ]);
};
