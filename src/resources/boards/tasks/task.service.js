const tasksRepo = require('./task.db.repository');

const getAll = id => tasksRepo.getAll(id);

const getById = id => tasksRepo.getById(id);

const create = task => tasksRepo.create(task);

const update = (id, task) => tasksRepo.update(id, task);

const remove = id => tasksRepo.remove(id);

module.exports = { getAll, getById, create, update, remove };
