const mongoose = require('mongoose');
const { CONFLICT } = require('http-status-codes');
const { users } = require('./user.model');
const { NotFoundError } = require('../../common/errors/notFoundError');

const getAll = async () => await users.find().select('-password');

const getById = async id => {
  const user = await users.findOne({ _id: id }).select('-password');

  if (!user) throw new NotFoundError(`The user with id ${id} was not found`);

  return user;
};

const create = async userData => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  };

  const user = await users
    .findOneAndUpdate({ _id: mongoose.Types.ObjectId() }, userData, options)
    .select('-password');

  if (!user) {
    throw new Error('Could not create user', CONFLICT);
  }

  return user;
};

const update = async (id, data) => {
  const query = { _id: id };
  const options = { upsert: false, new: true, runValidators: true };

  const user = await users
    .findOneAndUpdate(query, data, options)
    .select('-password');

  if (!user) throw new NotFoundError(`Could not update user with id ${id}`);

  return user;
};

const remove = async id => {
  const user = await users.findOneAndDelete({ _id: id }).select('-password');

  if (!user) throw new NotFoundError(`Could not remove user with id ${id}`);

  return user;
};

module.exports = { getAll, getById, create, update, remove };
