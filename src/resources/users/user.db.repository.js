const createError = require('http-errors');
const { users } = require('./user.model');
const { NotFoundError } = require('../../common/errors/notFoundError');
const errorMessages = require('../../common/errors/errorMessages');

const getAll = async () => await users.find();

const getById = async id => {
  const user = await users.findOne({ _id: id });

  if (!user) throw new NotFoundError(`The user with id ${id} was not found`);

  return user;
};

const getByProperty = async entry => {
  const user = await users.findOne(entry);

  return user;
};

const create = async (userData, session) => {
  const user = await users.create([userData], { session });

  return user;
};

const update = async (id, data) => {
  const query = { _id: id };
  const options = { upsert: false, new: true, runValidators: true };

  const user = await users.findOneAndUpdate(query, data, options);

  if (!user) throw new NotFoundError(`Could not update user with id ${id}`);

  return user;
};

const remove = async id => {
  const user = await users.findOneAndDelete({ _id: id });

  if (!user) throw new NotFoundError(`Could not remove user with id ${id}`);

  return user;
};

const activate = async token => {
  const query = { activationToken: token };
  const data = { inactive: false, activationToken: null };
  const options = { upsert: false, new: true };

  const user = await users.findOneAndUpdate(query, data, options);

  if (!user) {
    throw new createError.BadRequest(errorMessages.account_activation_failure);
  }

  return user;
};

module.exports = {
  getAll,
  getById,
  getByProperty,
  create,
  update,
  remove,
  activate
};
