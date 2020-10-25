const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { users } = require('./user.model');
const { NotFoundError } = require('../../common/errors/notFoundError');

const saltRounds = 10;

const getAll = async () =>
  await users
    .find()
    .select('-password')
    .lean();

const getById = async id => {
  const user = await users
    .findOne({ _id: id })
    .select('-password')
    .lean();

  if (!user) throw new NotFoundError(`The user with id ${id} was not found`);

  return user;
};

const create = async userData => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
  const data = {
    ...userData,
    password: hashedPassword
  };

  const user = await users
    .findOneAndUpdate({ _id: mongoose.Types.ObjectId() }, data, options)
    .select('-password')
    .lean();

  if (!user) {
    throw new Error('Could not create user');
  }

  return user;
};

const update = async (id, data) => {
  const query = { _id: id };
  const options = { upsert: false, new: true };

  const user = await users
    .findOneAndUpdate(query, data, options)
    .select('-password')
    .lean();

  if (!user) throw new NotFoundError(`Could not update user with id ${id}`);

  return user;
};

const remove = async id => {
  const user = await users
    .deleteOne({ _id: id })
    .select('-password')
    .lean();

  if (!user) throw new NotFoundError(`Could not remove user with id ${id}`);

  return user;
};

module.exports = { getAll, getById, create, update, remove };
