import 'dotenv/config';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import Schema from './src/schema/schema.js';
import jwt from 'express-jwt';

const app = express();
const port = 3000;

const auth = jwt({
  secret: 'key',
  credentialsRequired: false,
  algorithms: ['RS256'] 
})

app.use('/graphql', graphqlHTTP({ schema: Schema, auth, graphiql: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
