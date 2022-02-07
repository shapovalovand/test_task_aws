import { gql } from 'apollo-server';

const typeDefs = gql`
type File {
  uri: String!
  filename: String!
  mimetype: String!
  encoding: String!
}

type Query {
  uploads: [File]
}

type Mutation {
  uploadAvatar(file: Upload!): File
}
`;

export default typeDefs;