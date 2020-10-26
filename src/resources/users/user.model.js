const mongoose = require('mongoose');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { tasks } = require('../boards/tasks/task.model');

const SALT_ROUNDS = 10;

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
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

UserSchema.pre('findOneAndUpdate', async function(next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(
      this._update.password,
      SALT_ROUNDS
    );
  }

  next();
});

UserSchema.post('findOneAndDelete', async (doc, next) => {
  const query = { userId: doc._id };
  const data = { userId: null };

  await tasks.updateMany(query, data);

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
