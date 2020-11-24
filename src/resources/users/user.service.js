const usersRepo = require('./user.db.repository');
const tasksRepo = require('../boards/tasks/task.db.repository');

const getAll = () => usersRepo.getAll();

const getById = id => usersRepo.getById(id);

const getByProperty = entry => usersRepo.getByProperty(entry);

const create = user => usersRepo.create(user);

const update = (id, user) => usersRepo.update(id, user);

const remove = async userId => {
  const user = await usersRepo.remove(userId);
  await tasksRepo.updateTasksUser(user.id);

  return user;
};

module.exports = { getAll, getById, getByProperty, create, update, remove };
