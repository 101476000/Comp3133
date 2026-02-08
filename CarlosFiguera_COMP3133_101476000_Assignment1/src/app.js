const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs } = require('./schema/typeDefs');
const { resolvers } = require('./schema/resolvers');
const { connectDb } = require('./config/db');
const { getUserFromRequest } = require('./utils/auth');
const { configureCloudinary } = require('./config/cloudinary');

async function createExpressApp() {
  await connectDb();
  configureCloudinary();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  app.get('/', (req, res) => {
    res.status(200).json({ ok: true, service: 'COMP3133 Assignment 1 API', graphql: '/graphql' });
  });

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });

  await apolloServer.start();

  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const user = await getUserFromRequest(req);
      return { user, req };
    }
  }));

  return app;
}

module.exports = { createExpressApp };
