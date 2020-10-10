const DB = require('../../common/DB/users');

const getAll = async () => await DB.getAllUsers();

const getById = async id => {
  const user = await DB.getUser(id);

  if (!user) throw new Error(`The user with id ${id} was not found`);

  return user;
};

const create = async user => {
  const newUser = await DB.createUser(user);

  if (!newUser) throw new Error(`Could not create user with id ${user.id}`);

  return newUser;
};

const update = async (id, data) => {
  const user = await DB.updateUser(id, data);

  if (!user) throw new Error('Could not update user with id ${id}');

  return user;
};

const remove = async id => {
  const user = await DB.removeUser(id);

  if (!user) throw new Error('Could not remove user with id ${id}');

  return user;
};

module.exports = { getAll, getById, create, update, remove };
