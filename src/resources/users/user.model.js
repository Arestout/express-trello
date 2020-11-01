const mongoose = require('mongoose');
const uuid = require('uuid');
const hashPassword = require('../../utils/auth/hashPassword');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  login: {
    type: String,
    required: true,
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
    hashPassword(this._update.password);
  }

  next();
});

UserSchema.pre('save', async function(next) {
  hashPassword(this.password);

  next();
});

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

module.exports = { User, users };
