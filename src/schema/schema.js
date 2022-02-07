import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
  } from 'graphql';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import db from '../models/models.js';

const userDB = db.models.user;

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is represents a user',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id
        }
      },
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.username
        }
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email
        }
      },
      token: {
        type: GraphQLString,
        resolve(user) {
          return user.token
        }
      }
    }
  }
});

const UploadFile = new GraphQLObjectType({
  name: 'File',
  description: 'This is represents a file',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(uploadFile) {
          return uploadFile.id
        }
      },
      filename: {
        type: GraphQLString,
        resolve(uploadFile) {
          return uploadFile.filename
        }
      },
      mimetype: {
        type: GraphQLString,
        resolve(uploadFile) {
          return uploadFile.mimetype
        }
      },
      encoding: {
        type: GraphQLString,
        resolve(uploadFile) {
          return uploadFile.encoding
        }
      },
      uri: {
        type: GraphQLString,
        resolve(uploadFile) {
          return uploadFile.uri
        }
      },
    }
  }
});

const File = new GraphQLObjectType({
  name: 'File',
  description: 'This is represents a file',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(file) {
          return file.id
        }
      },
      filename: {
        type: GraphQLString,
        resolve(file) {
          return file.filename
        }
      },
      mimetype: {
        type: GraphQLString,
        resolve(file) {
          return file.mimetype
        }
      },
      encoding: {
        type: GraphQLString,
        resolve(file) {
          return file.encoding
        }
      },
      stream: {
        type: GraphQLString,
        resolve(file) {
          return file.stream
        }
      },
    }
  }
});
  
  const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Query for get user info',
    fields: () => {
      return {
        getUser: {
          type: new GraphQLList(File),
          args: {
            id: {
              type: GraphQLInt
            },
            token: {
              type: GraphQLString
            }
          },
          resolve: async (root, {id, token}) => {
            const isValid = await jsonwebtoken.verify(
              token,
              process.env.SIGNATURE,
              {expiresIn: process.env.EXPIRATION}
            )
  
            if (isValid.id !== id) throw new Error('Incorrect token');
  
            return db.models.user.findAll({where: {id}});
          }
        },
        getFile: {
          type: new GraphQLList(User),
          args: {
            id: {
              type: GraphQLInt
            }
          },
          resolve: async (root, {id}) => {
            return db.models.file.findAll({where: {id}});
          }
        }
      }
    }
  });
  
  const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => {
      return {
        singUp: {
          type: User,
          description: 'mutation for sing up',
          args: {
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            },
            username: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: async (_, {email, password, username}) => {
            const isUniqEmail = await userDB.findOne({where: {email}});
  
            if (isUniqEmail) throw new Error('User with this email already exist');
  
            const user = await userDB.create({
              username,
              email,
              password: await bcrypt.hash(password, 10)
            });
  
  
            const token = await jsonwebtoken.sign(
              {id: user.id, email: user.email},
              process.env.SIGNATURE,
              {expiresIn: process.env.EXPIRATION})
  
            return {id: user.id, email: user.email, token};
          }
        },
        singIn: {
          type: User,
          description: 'mutation for sing in',
          args: {
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: async (_, {email, password}) => {
            const user = await userDB.findOne({where: {email}});
  
            if (!user) throw new Error('User with this email not found');
  
            const isValid = await bcrypt.compare(password, user.password);
  
            if (!isValid) throw new Error('Incorrect password');
  
            const token = await jsonwebtoken.sign(
              {id: user.id, email: user.email},
              process.env.SIGNATURE,
              {expiresIn: process.env.EXPIRATION})
  
            return {id: user.id, email: user.email, token};
          }
        },
        updateUser: {
          type: User,
          description: 'mutation for update user info',
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            email: {
              type: GraphQLString,
            },
            password: {
              type: GraphQLString
            },
            username: {
              type: GraphQLString
            },
            token: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: async (_, {token, id, ...params}) => {
            const isValid = await jsonwebtoken.verify(token, process.env.SIGNATURE, {expiresIn: process.env.EXPIRATION})
  
            if (isValid.id !== id) throw new Error('Incorrect token');
  
            if ('password' in params) {
              params.password = await bcrypt.hash(params.password, 10);
            }
  
            await userDB.update({...params}, {where: {id}})
  
            return await userDB.findOne({where: {id}});
          }
        },
        deleteUser: {
          type: User,
          description: 'mutation for delete user info',
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            token: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: async (_, {token, id}) => {
            const isValid = await jsonwebtoken.verify(
              token,
              process.env.SIGNATURE,
              {expiresIn: process.env.EXPIRATION}
            )
  
            if (isValid.id !== id) throw new Error('Incorrect token');
  
            await userDB.destroy({where: {id}});
  
            return {id}
          }
        },
      }
    }
  });
  
  const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutations
  });
  
  export default Schema;