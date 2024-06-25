import { gql } from '@apollo/client/core';
import type { User } from '../../../@types/User';

export const AUTH_MUTATION = gql`
  mutation Auth($input: AuthInput!) {
    Auth(input: $input) {
      token
      user {
        name
        updatedAt
        email
        id
        createdAt
      }
    }
  }
`;

export interface AuthMutationResponse {
  Auth: {
    token: string;
    user: User;
  };
}

export const AUTH_NONCE_QUERY = gql`
  query GetNonce {
    GetNonce {
      nonce
    }
  }
`;

export interface GetNonceQueryResponse {
  GetNonce: {
    nonce: string;
  };
}
