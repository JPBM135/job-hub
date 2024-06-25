import { gql } from 'graphql-tag';

export const schema = gql`
  type Query {
    GetNonce: GetNonce!
  }

  type Mutation {
    Auth(input: AuthInput!): UserWithToken!
  }

  type GetNonce {
    nonce: String!
  }

  input AuthInput {
    email: String!
    password: String!
    nonce: String!
  }
`;
