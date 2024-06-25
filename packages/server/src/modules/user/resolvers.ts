import type { Users } from '../../@types/db.schema.js';
import { dateResolver } from '../../core/utils/dateResolver.js';
import type { JobHubResolverMap, JobHubUnitResolver } from '../interfaces.js';
import { UpdateMe } from './mutations/updateMe.js';

interface UnitResolvers {
  User: JobHubUnitResolver<Users>;
}

type UserResolvers = JobHubResolverMap<
  null,
  {
    UpdateMe: typeof UpdateMe;
  },
  UnitResolvers
>;

export const resolvers: UserResolvers = {
  Mutation: {
    UpdateMe,
  },
  User: {
    createdAt: (user) => dateResolver(user.created_at),
    updatedAt: (user) => dateResolver(user.updated_at),
  },
};
