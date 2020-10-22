const usersRepo = require('./user.db.repository');
const tasksRepo = require('../boards/tasks/task.db.repository');

const getAll = async () => usersRepo.getAll();

const getById = async id => usersRepo.getById(id);

const create = async user => usersRepo.create(user);

const update = async (id, user) => usersRepo.update(id, user);

const remove = async userId => {
  const user = await usersRepo.remove(userId);

  if (user.deletedCount > 0) await tasksRepo.updateTasksUser(userId);

  return true;
};

module.exports = { getAll, getById, create, update, remove };
