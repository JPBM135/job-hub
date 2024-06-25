import { gql } from 'graphql-tag';

export const schema = gql`
  type Query {
    GetNonce: GetNonce!
  }

  type Mutation {
    Auth(input: AuthInput!): AuthResponse!
  }

  type GetNonce {
    nonce: String!
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  input AuthInput {
    email: String!
    password: String!
    nonce: String!
  }
`;
