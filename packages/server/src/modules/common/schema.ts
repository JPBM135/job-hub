import { gql } from 'graphql-tag';

export const schema = gql`
  directive @requireAuth on FIELD_DEFINITION

  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type PageInfo {
    count: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`;
