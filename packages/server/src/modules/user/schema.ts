import { gql } from 'graphql-tag';

export const schema = gql`
  type Mutation {
    UpdateMe(input: UserInput!): UserWithToken!
  }

  input UserInput {
    email: String!
    name: String!
    currentPassword: String
    newPassword: String
  }

  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
  }
`;
