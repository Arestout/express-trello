const uuid = require('uuid');

const UserSchemaPut = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    login: { type: 'string' },
    password: { type: 'string' }
  }
};

const UserSchemaPost = {
  ...UserSchemaPut,
  required: ['name', 'login', 'password']
};

class User {
  constructor({
    id = uuid(),
    name = 'USER',
    login = 'user',
    password = 'P@55w0rd'
  } = {}) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.password = password;
  }

  static toResponse(user) {
    const { id, name, login } = user;
    return { id, name, login };
  }
}

module.exports = { User, UserSchemaPost, UserSchemaPut };
