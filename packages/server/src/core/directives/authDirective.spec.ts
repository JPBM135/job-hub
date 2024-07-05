import { getDirective } from '@graphql-tools/utils';
import { JobHubError } from 'core/error/JobHubError.js';
import { JobHubErrorCodes } from 'core/error/codes.js';
import { buildSchema } from 'graphql';
import { describe, expect, it, vitest } from 'vitest';
import { RequireAuthDirective } from './authDirective.js';

const testSchema = () => {
  const schema = buildSchema(/* GraphQL */ `
    directive @requireAuth on FIELD_DEFINITION

    type Query {
      hello: String @requireAuth
    }
  `);

  const query = schema.getQueryType();

  query!.getFields()!.hello!.resolve = () => 'Hello World!';

  return schema;
};

vitest.mock('@graphql-tools/utils', async (original) => ({
  ...((await original()) as {}),
  getDirective: vitest.fn(() => ({ requireAuth: true })),
}));

describe('RequireAuthDirective', () => {
  it('RequireAuthDirective throws an error when user is not authenticated', async () => {
    const schema = testSchema();
    const wrappedSchema = RequireAuthDirective(schema);

    const helloField = wrappedSchema.getQueryType()?.getFields().hello;

    try {
      await helloField!.resolve!({}, {}, {}, {} as any);
    } catch (error) {
      const castError = error as JobHubError;

      expect(castError).toBeInstanceOf(JobHubError);
      expect(castError.message).toBe(
        'You must be authenticated to access this resource',
      );
      expect(castError.extensions.code).toBe(JobHubErrorCodes.Unauthorized);
    }
  });

  it('RequireAuthDirective should not throw an error when user is authenticated', async () => {
    const schema = testSchema();

    const wrappedSchema = RequireAuthDirective(schema);

    const helloField = wrappedSchema.getQueryType()?.getFields().hello;

    expect(
      await helloField!.resolve!(
        {},
        {},
        { authenticatedUser: true },
        {} as any,
      ),
    ).toBe('Hello World!');
  });

  it('RequireAuthDirective should not throw an error when directive is not present', async () => {
    vitest.mocked(getDirective).mockReturnValue(null as any);

    const schema = testSchema();

    const wrappedSchema = RequireAuthDirective(schema);

    const helloField = wrappedSchema.getQueryType()?.getFields().hello;

    expect(await helloField!.resolve!({}, {}, {}, {} as any)).toBe(
      'Hello World!',
    );
  });
});
