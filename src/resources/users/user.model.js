const mongoose = require('mongoose');
const uuid = require('uuid');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      default: uuid
    },
    name: {
      type: String,
      required: true
    },
    login: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { versionKey: false }
);

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

const users = mongoose.model('users', UserSchema);
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

module.exports = { User, UserSchemaPost, UserSchemaPut, users };
