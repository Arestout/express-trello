const { users } = require('./user.model');
const { NotFoundError } = require('../../common/errors/notFoundError');

const getAll = async () =>
  await users
    .find()
    .select('-_id -password')
    .lean();

const getById = async id => {
  const user = await users
    .findOne({ id })
    .select('-_id -password')
    .lean();

  if (!user) throw new NotFoundError(`The user with id ${id} was not found`);

  return user;
};

const create = async userData => {
  const newUser = await users.create(userData);

  if (!newUser) {
    throw new Error(`Could not create user with id ${userData.id}`);
  }

  const { id, name, login } = newUser;
  const user = { id, name, login };

  return user;
};

const update = async (id, data) => {
  const query = { id };
  const options = { upsert: false, new: true };

  const user = await users
    .findOneAndUpdate(query, data, options)
    .select('-_id -password')
    .lean();

  if (!user) throw new NotFoundError(`Could not update user with id ${id}`);

  return user;
};

const remove = async id => {
  const user = await users
    .deleteOne({ id })
    .select('-_id -password')
    .lean();

  if (!user) throw new NotFoundError(`Could not remove user with id ${id}`);

  return user;
};

module.exports = { getAll, getById, create, update, remove };
