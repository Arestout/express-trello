const mongoose = require('mongoose');
const uuid = require('uuid');
const hashPassword = require('../../utils/auth/hashPassword');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  login: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.method('toJSON', function() {
  const { __v, _id, password, ...object } = this.toObject();
  return { id: _id, ...object };
});

UserSchema.pre('findOneAndUpdate', async function(next) {
  if (this._update.password) {
    this._update.password = await hashPassword(this._update.password);
  }

  next();
});

UserSchema.pre('save', async function(next) {
  this.password = await hashPassword(this.password);
  next();
});

const users = mongoose.model('users', UserSchema);
class User {
  constructor({
    id = uuid(),
    name = 'USER',
    login = 'user',
    email = 'user@mail.com',
    password = 'P@55w0rd'
  } = {}) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.email = email;
    this.password = password;
  }

  static toResponse(user) {
    const { id, name, login } = user;
    return { id, name, login };
  }
}

module.exports = { User, users };
