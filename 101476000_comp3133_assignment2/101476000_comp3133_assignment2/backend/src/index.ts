import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employees';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });

  // Apollo GraphQL Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Extract JWT token from headers and verify
      const token = req.headers.authorization?.split('Bearer ')[1];
      // const user = token ? verifyToken(token) : null;
      return { user: null, token };
    },
  });

  // Start Apollo Server
  await server.start();

  // Mount Apollo middleware
  server.applyMiddleware({ app });

  // Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🔗 MongoDB URI: ${MONGODB_URI}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
