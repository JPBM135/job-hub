import process from 'node:process';
import type { ApolloServer } from '@apollo/server';
import type { AppContext } from '../../@types/common.js';

export function registerSignalEvents(server: ApolloServer<AppContext>) {
  process.on('SIGINT', async () => {
    console.log('SIGINT received. Exiting...');
    await server.stop();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Exiting...');
    await server.stop();
    process.exit(0);
  });
}
