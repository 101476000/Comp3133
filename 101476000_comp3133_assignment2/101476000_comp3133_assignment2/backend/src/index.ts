import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/typeDefs';
import { resolvers, verifyToken } from './graphql/resolvers';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employees';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

async function connectDB() {
  try {
      await mongoose.connect(MONGODB_URI);
          console.log('MongoDB connected successfully');
            } catch (error) {
                console.error('MongoDB connection error:', error);
                    process.exit(1);
                      }
                      }

                      async function startServer() {
                        await connectDB();

                          const app = express();

                            app.use(cors({
                                origin: [FRONTEND_URL, 'https://assignment2-comp3133-frontend.vercel.app', /\.vercel\.app$/],
                                    credentials: true,
                                      }));

                                        app.use(express.json());

                                          app.get('/health', (req, res) => {
                                              res.json({ status: 'OK', message: 'Server is running', mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
                                                });

                                                  const server = new ApolloServer({
                                                      typeDefs,
                                                          resolvers,
                                                              context: ({ req }) => {
                                                                    const token = req.headers.authorization?.split('Bearer ')[1];
                                                                          const user = token ? verifyToken(token) : null;
                                                                                return { user, token };
                                                                                    },
                                                                                      });

                                                                                        await server.start();
                                                                                          server.applyMiddleware({ app, cors: false });

                                                                                            app.listen(PORT, () => {
                                                                                                console.log(`Server running at http://localhost:${PORT}`);
                                                                                                    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
                                                                                                      });
                                                                                                      }

                                                                                                      startServer().catch((error) => {
                                                                                                        console.error('Failed to start server:', error);
                                                                                                          process.exit(1);
                                                                                                          });