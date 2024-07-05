import { mergeResolvers } from '@graphql-tools/merge';
import { resolvers as AuthResolvers } from './auth/resolvers.js';
import { resolvers as CommonResolvers } from './common/resolvers.js';
import { resolvers as JobResolvers } from './jobs/resolvers.js';
import { resolvers as UserResolvers } from './user/resolvers.js';

export const resolvers = mergeResolvers([
  CommonResolvers,
  AuthResolvers,
  JobResolvers,
  UserResolvers,
]);
