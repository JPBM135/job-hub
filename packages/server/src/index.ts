import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { NextHandleFunction } from 'connect';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import type { AppContext } from './@types/index.js';
import { config } from './config.js';
import { createContext } from './core/context/createContext.js';
import DisconnectDatabasePlugin from './core/database/cleanDatabasePlugin.js';
import { RequireAuthDirective } from './core/directives/authDirective.js';
import ApolloServerSentryPlugin from './core/sentry/apolloServerSentry.js';
import { Sentry } from './core/sentry/sentry.js';
import { registerSignalEvents } from './core/utils/registerSignalEvents.js';
import { resolvers } from './modules/resolvers.js';
import { typeDefs } from './modules/schema.js';

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

schema = RequireAuthDirective(schema);

const server = new ApolloServer<AppContext>({
  introspection: !config.isProduction,
  includeStacktraceInErrorResponses: !config.isProduction,
  schema,
  plugins: [ApolloServerSentryPlugin(), DisconnectDatabasePlugin()],
});

await server.start();

const app = express();

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(helmet());
app.use(cors());
app.use(
  express.json({
    limit: '5mb',
  }),
);

const healthMiddleware: NextHandleFunction = async (req, res, next) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: 'ready' }));
    res.end();

    return;
  }

  next();
};

app.use(healthMiddleware);

app.use(
  expressMiddleware<AppContext>(server, {
    context: createContext,
  }),
);
app.use(Sentry.Handlers.errorHandler());

// eslint-disable-next-line no-promise-executor-return
await new Promise<void>((resolve) => app.listen({ port: config.port }, resolve));
console.log(`Server is running on port ${config.port}`);

app.on('error', (error) => {
  console.error(error);
});

registerSignalEvents(server);

export default app;
