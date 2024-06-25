import type { Users } from '../../@types/db.schema.js';
import { dateResolver } from '../../core/utils/dateResolver.js';
import type { JobHubResolverMap, JobHubUnitResolver } from '../interfaces.js';

interface UnitResolvers {
  User: JobHubUnitResolver<Users>;
}

type AuthResolvers = JobHubResolverMap<null, null, UnitResolvers>;

export const resolvers: AuthResolvers = {
  User: {
    createdAt: (user) => dateResolver(user.created_at),
    updatedAt: (user) => dateResolver(user.updated_at),
  },
};
