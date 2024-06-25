import { GraphQLSchema } from 'graphql';
import { expect } from 'vitest';

export async function testSchemaForUnauthorizedAccess(
  schema: GraphQLSchema,
  DANGEROUSLY_IGNORED_RESOLVERS: string[] = [],
) {
  const query = schema.getQueryType();
  const mutation = schema.getMutationType();

  expect(query).toBeDefined();
  expect(mutation).toBeDefined();

  const queryFields = query!.getFields();
  const mutationFields = mutation!.getFields();

  const fields = Object.values(queryFields).concat(Object.values(mutationFields));

  for (const field of fields) {
    if (DANGEROUSLY_IGNORED_RESOLVERS.includes(field.name)) {
      continue;
    }

    expect(field.resolve, `Field ${field.name} does not have a resolver`).toBeDefined();

    const message = `Unrecognized error thrown or Non-authenticated user had access on the resource for field "${field.name}"`;

    let errorThrow: Error | null = null;
    try {
      await field.resolve?.({}, {}, {}, {} as any);
    } catch (error) {
      errorThrow = error as Error;
      expect((errorThrow as Error).message, message).toContain('You must be authenticated to access this resource');
    } finally {
      expect(errorThrow, message).not.toBeNull();
    }
  }
}
