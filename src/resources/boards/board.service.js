const boardsRepo = require('./board.db.repository');

const getAll = () => boardsRepo.getAll();

const getById = id => boardsRepo.getById(id);

const create = board => boardsRepo.create(board);

const update = (id, board) => boardsRepo.update(id, board);

const remove = boardId => boardsRepo.remove(boardId);

module.exports = { getAll, getById, create, update, remove };
