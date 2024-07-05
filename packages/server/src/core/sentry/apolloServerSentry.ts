import type {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from '@apollo/server';
import type { PolymorphicRequest } from '@sentry/node';
import type { AppContext } from '../../@types/index.js';
import { Sentry } from './sentry.js';

export default function ApolloServerSentryPlugin(): ApolloServerPlugin<AppContext> {
  return {
    async requestDidStart({
      request,
      contextValue,
    }): Promise<GraphQLRequestListener<AppContext>> {
      if (request.operationName) {
        contextValue.transaction.setName(request.operationName);
      }

      return {
        async willSendResponse() {
          contextValue.transaction.finish();
        },
        async executionDidStart() {
          return {
            willResolveField({ info }) {
              const span = contextValue.transaction.startChild({
                op: 'resolver',
                description: `${info.parentType.name}.${info.fieldName}`,
              });
              return () => {
                span.finish();
              };
            },
          };
        },
        async didEncounterErrors({
          request,
          operation,
          operationName,
          errors,
        }) {
          Sentry.withScope((scope) => {
            scope.addEventProcessor((event) =>
              Sentry.addRequestDataToEvent(
                event,
                request as PolymorphicRequest,
              ),
            );

            scope.setTags({
              graphql: operation?.operation ?? 'parse_err',
              graphqlName: operationName ?? request.operationName,
            });

            const transactionId = request.http?.headers.get('x-transaction-id');
            if (transactionId) {
              scope.setTransactionName(transactionId);
            }

            for (const error of errors) {
              scope.setTag('kind', operation?.operation ?? 'unnamed operation');
              scope.setExtra('query', request.query);
              scope.setExtra(
                'variables',
                JSON.stringify(request.variables, null, 2),
              );
              scope.setExtra('errorMessage', error.message);
              scope.setExtra('errorCode', error.extensions?.code);
              scope.setExtra('errorStack', error.stack);
              scope.setExtra('query', request.query);

              if (error.path || error.name !== 'GraphQLError') {
                scope.setExtras({ path: error.path });
                Sentry.captureException(error);
              } else {
                scope.setExtras({});
                Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
              }
            }
          });
        },
      };
    },
  };
}
