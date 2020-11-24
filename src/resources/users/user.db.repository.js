const { users } = require('./user.model');
const { NotFoundError } = require('../../common/errors/notFoundError');

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

const create = async userData => {
  const user = await users.create(userData);

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

module.exports = { getAll, getById, getByProperty, create, update, remove };
