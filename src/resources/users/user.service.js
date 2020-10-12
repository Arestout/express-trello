const usersRepo = require('./user.memory.repository');
const tasksRepo = require('../boards/tasks/task.memory.repository');

const getAll = async () => await usersRepo.getAll();

const getById = async id => await usersRepo.getById(id);

const create = async user => await usersRepo.create(user);

const update = async (id, user) => await usersRepo.update(id, user);

const remove = async id => {
  const user = await usersRepo.remove(id);
  await tasksRepo.updateTasksUser(user.id);

  return user;
};

module.exports = { getAll, getById, create, update, remove };
