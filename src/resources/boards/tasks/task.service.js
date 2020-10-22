const tasksRepo = require('./task.db.repository');

const getAll = async id => tasksRepo.getAll(id);

const getById = async id => tasksRepo.getById(id);

const create = async task => tasksRepo.create(task);

const update = async (id, task) => tasksRepo.update(id, task);

const remove = async id => tasksRepo.remove(id);

module.exports = { getAll, getById, create, update, remove };
