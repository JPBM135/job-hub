import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';
import {
  AUTH_MUTATION,
  AUTH_NONCE_QUERY,
  type GetNonceQueryResponse,
  type AuthMutationResponse,
} from './auth-api.graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  public constructor(private readonly apollo: Apollo) {}

  public getNonce() {
    return this.apollo
      .query<GetNonceQueryResponse>({
        query: AUTH_NONCE_QUERY,
      })
      .pipe(map((response) => response.data.GetNonce));
  }

  public login({
    email,
    password,
    nonce,
  }: {
    email: string;
    nonce: string;
    password: string;
  }) {
    return this.apollo
      .mutate<AuthMutationResponse>({
        mutation: AUTH_MUTATION,
        variables: {
          input: {
            email,
            password,
            nonce,
          },
        },
      })
      .pipe(map((response) => response.data?.Auth));
  }
}
