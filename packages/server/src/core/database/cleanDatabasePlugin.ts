import type { ApolloServerPlugin } from '@apollo/server';
import type { AppContext } from '../../@types/index.js';

export default function DisconnectDatabasePlugin(): ApolloServerPlugin<AppContext> {
  return {
    requestDidStart: async () => ({
      willSendResponse: async ({ contextValue: { db } }) => {
        await db.destroy();
      },
      didEncounterErrors: async ({ contextValue: { db } }) => {
        await db.destroy();
      },
    }),
  };
}
