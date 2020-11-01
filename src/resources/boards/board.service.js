const boardsRepo = require('./board.db.repository');
const tasksRepo = require('./tasks/task.db.repository');

const getAll = () => boardsRepo.getAll();

const getById = id => boardsRepo.getById(id);

const create = board => boardsRepo.create(board);

const update = (id, board) => boardsRepo.update(id, board);

const remove = async boardId => {
  const board = await boardsRepo.remove(boardId);
  await tasksRepo.removeTasksByBoardId(board.id);

  return board;
};

module.exports = { getAll, getById, create, update, remove };
