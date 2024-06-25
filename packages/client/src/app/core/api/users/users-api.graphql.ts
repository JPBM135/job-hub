import { gql } from '@apollo/client/core';
import type { User } from '../../../@types/User';

export const UPDATE_ME_MUTATION = gql`
  mutation Mutation($input: UserInput!) {
    UpdateMe(input: $input) {
      token
      user {
        id
        name
        email
        updatedAt
        createdAt
      }
    }
  }
`;

export interface UpdateMeInput {
  currentPassword?: string;
  email: string;
  name: string;
  newPassword?: string;
}

export interface UpdateMeResponse {
  UpdateMe: {
    token: string;
    user: User;
  };
}
