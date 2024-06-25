import { gql } from 'graphql-tag';

export const schema = gql`
  directive @requireAuth on FIELD_DEFINITION

  type PageInfo {
    count: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type UserWithToken {
    user: User!
    token: String!
  }
`;
