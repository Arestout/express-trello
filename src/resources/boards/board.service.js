const boardsRepo = require('./board.memory.repository');

const getAll = async () => await boardsRepo.getAll();

const getById = async id => await boardsRepo.getById(id);

const create = async board => await boardsRepo.create(board);

const update = async (id, board) => await boardsRepo.update(id, board);

const remove = async id => await boardsRepo.remove(id);

module.exports = { getAll, getById, create, update, remove };
