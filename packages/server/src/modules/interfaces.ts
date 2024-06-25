import type { AddStringToDates, AppContext, If, TransformRecordToCamelCase, TypedOmit } from '../@types/index.js';

type MutualResolver = JobHubResolver<unknown, any, true> | JobHubResolver<unknown, any>;

type MaybeExtendsMutualMutationResolver<TMutationResolvers> = TMutationResolvers extends Record<string, MutualResolver>
  ? {
      Mutation: {
        [TMutationResolverKey in keyof TMutationResolvers]: TMutationResolvers[TMutationResolverKey];
      };
    }
  : {};

type MaybeExtendsMutualQueryResolver<TQueriesResolvers> = TQueriesResolvers extends Record<string, MutualResolver>
  ? {
      Query: {
        [TQueryResolverKey in keyof TQueriesResolvers]: TQueriesResolvers[TQueryResolverKey];
      };
    }
  : {};

type MaybeExtendsUnitResolver<T> = T extends JobHubUnitResolver<unknown, unknown> ? T : {};

type AppContextWithoutUser = TypedOmit<AppContext, 'authenticatedUser'> & {
  authenticatedUser: null;
};

type AppContextWithUser = TypedOmit<AppContext, 'authenticatedUser'> & {
  authenticatedUser: NonNullable<AppContext['authenticatedUser']>;
};

export type JobHubResolver<TResponse, TVariables, TIsAuth = false> = (
  parent: unknown,
  args: TVariables,
  context: If<TIsAuth, true, AppContextWithUser, AppContextWithoutUser>,
  info: unknown,
) => Promise<TResponse>;

export type JobHubResolverMap<
  TQueriesResolvers extends Record<string, MutualResolver> | null,
  TMutationResolvers extends Record<string, MutualResolver> | null,
  TUnitResolvers extends JobHubUnitResolver<unknown, unknown> | null = null,
  // eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
> = MaybeExtendsMutualMutationResolver<TMutationResolvers> &
  MaybeExtendsMutualQueryResolver<TQueriesResolvers> &
  MaybeExtendsUnitResolver<{
    [TUnitResolverKey in keyof TUnitResolvers]: TUnitResolvers[TUnitResolverKey];
  }>;

export type JobHubUnitResolver<TParent, TArgs = TransformRecordToCamelCase<TParent>, TIsAuth = false> = {
  [P in keyof TArgs]?: (
    parent: TParent,
    args: TArgs,
    context: If<TIsAuth, true, AppContextWithUser, AppContextWithoutUser>,
    info: unknown,
  ) => AddStringToDates<TArgs[P]> | Promise<AddStringToDates<TArgs[P]>>;
};
