import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';

const sequelize = new Sequelize(
    'some_db', 
    'root', 
    'root_password', 
    {
    host: 'localhost',
    dialect: 'postgres'
  });

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const File = sequelize.define('file', {
  filename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mimetype: {
    type: Sequelize.STRING,
    allowNull: false
  },
  encoding: {
    type: Sequelize.STRING,
    allowNull: false
  },
  stream: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


sequelize.sync({ force: true }).then(async () => {
  return File.create({
    filename: 'Dons',
    mimetype: 'hhh@mail.ru',
    encoding: 'saf',
    uri: 'uri'
  })
});

export default sequelize;