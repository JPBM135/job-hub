import { GraphQLError, type GraphQLErrorOptions } from 'graphql';

export class JobHubError extends GraphQLError {
  public constructor(
    message: string,
    code: string,
    options?: GraphQLErrorOptions,
  ) {
    super(message, {
      ...options,
      extensions: {
        ...options?.extensions,
        code,
      },
    });
  }
}
