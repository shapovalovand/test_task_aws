import { ApolloServer } from 'apollo-server';
import typeDefs from './typedefs.js';
import Mutation from './resolvers.js';

export default server = new ApolloServer({
  typeDefs,
  Mutation,
});