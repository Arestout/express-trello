const usersRepo = require('./user.memory.repository');

const getAll = async () => await usersRepo.getAll();

const getById = async id => await usersRepo.getById(id);

const create = async user => await usersRepo.create(user);

const update = async (id, user) => await usersRepo.update(id, user);

const remove = async id => await usersRepo.remove(id);

module.exports = { getAll, getById, create, update, remove };
