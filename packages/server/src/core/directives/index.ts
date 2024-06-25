/* eslint-disable no-param-reassign */
import type { GraphQLSchema } from 'graphql';
import { RequireAuthDirective } from './authDirective.js';

export function applyDirectives(schema: GraphQLSchema): GraphQLSchema {
  schema = RequireAuthDirective(schema);

  return schema;
}
