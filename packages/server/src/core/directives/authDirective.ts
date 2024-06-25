import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';
import { JobHubError } from '../error/JobHubError.js';
import { JobHubErrorCodes } from '../error/codes.js';

export function RequireAuthDirective(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'requireAuth');
      if (!directive) {
        return fieldConfig;
      }

      const defaultFieldResolver = fieldConfig.resolve;
      // eslint-disable-next-line func-names
      fieldConfig.resolve = async function (...args) {
        const context = args[2];
        if (!context.authenticatedUser) {
          throw new JobHubError('You must be authenticated to access this resource', JobHubErrorCodes.Unauthorized);
        }

        return defaultFieldResolver?.apply(this, args);
      };

      return fieldConfig;
    },
  });
}
