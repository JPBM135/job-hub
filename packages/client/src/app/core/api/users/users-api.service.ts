import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';
import {
  UPDATE_ME_MUTATION,
  type UpdateMeInput,
  type UpdateMeResponse,
} from './users-api.graphql';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  public constructor(private readonly apollo: Apollo) {}

  public updateMe(input: UpdateMeInput) {
    return this.apollo
      .mutate<UpdateMeResponse>({
        mutation: UPDATE_ME_MUTATION,
        variables: {
          input,
        },
      })
      .pipe(map((response) => response.data?.UpdateMe));
  }
}
