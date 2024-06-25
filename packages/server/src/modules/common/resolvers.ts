import type { Users } from '../../@types/db.schema.js';
import type { JobHubResolverMap, JobHubUnitResolver } from '../interfaces.js';

interface UnitResolvers {
  User: JobHubUnitResolver<Users>;
}

type AuthResolvers = JobHubResolverMap<null, null, UnitResolvers>;

export const resolvers: AuthResolvers = {
  User: {
    createdAt: (user) => user.created_at,
    updatedAt: (user) => user.updated_at,
  },
};
