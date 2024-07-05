import { mergeTypeDefs } from '@graphql-tools/merge';
import { schema as authTypeDefs } from './auth/schema.js';
import { schema as globalTypeDefs } from './common/schema.js';
import { schema as jobTypeDefs } from './jobs/schema.js';
import { schema as userTypeDefs } from './user/schema.js';

export const typeDefs = mergeTypeDefs([
  globalTypeDefs,
  authTypeDefs,
  jobTypeDefs,
  userTypeDefs,
]);
