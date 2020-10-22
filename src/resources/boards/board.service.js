const boardsRepo = require('./board.db.repository');
const tasksRepo = require('./tasks/task.db.repository');

const getAll = async () => boardsRepo.getAll();

const getById = async id => boardsRepo.getById(id);

const create = async board => boardsRepo.create(board);

const update = async (id, board) => boardsRepo.update(id, board);

const remove = async boardId => {
  const board = await boardsRepo.remove(boardId);

  if (board.deletedCount > 0) await tasksRepo.removeTasksByBoardId(boardId);

  return true;
};

module.exports = { getAll, getById, create, update, remove };
