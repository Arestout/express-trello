const tasksRepo = require('./task.memory.repository');

const getAll = async id => await tasksRepo.getAll(id);

const getById = async id => await tasksRepo.getById(id);

const create = async task => await tasksRepo.create(task);

const update = async (id, task) => await tasksRepo.update(id, task);

const remove = async id => await tasksRepo.remove(id);

module.exports = { getAll, getById, create, update, remove };
