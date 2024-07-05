import { importProvidersFrom } from '@angular/core';
import { InMemoryCache, type ApolloClientOptions } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../../../environment/environment';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';

export function provideApollo() {
  return [
    {
      provide: APOLLO_OPTIONS,
      useFactory(
        httpLink: HttpLink,
        errorHandlerService: ErrorHandlerService,
      ): ApolloClientOptions<any> {
        const http = httpLink.create({
          uri: environment.apiUrl,
        });

        const errorLink = onError((data) => {
          errorHandlerService.handleError(data);
        });

        const link = errorLink.concat(http);

        return {
          cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all',
            },
            query: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all',
            },
            mutate: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all',
            },
          },
          link,
          name: 'Job-Hub-Client',
        };
      },
      deps: [HttpLink, ErrorHandlerService],
    },
    importProvidersFrom(ApolloModule),
  ];
}
