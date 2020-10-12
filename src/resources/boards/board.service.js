const boardsRepo = require('./board.memory.repository');
const tasksRepo = require('./tasks/task.memory.repository');

const getAll = async () => await boardsRepo.getAll();

const getById = async id => await boardsRepo.getById(id);

const create = async board => await boardsRepo.create(board);

const update = async (id, board) => await boardsRepo.update(id, board);

const remove = async id => {
  const board = await boardsRepo.remove(id);
  await tasksRepo.removeTasksByBoardId(board.id);

  return board;
};

module.exports = { getAll, getById, create, update, remove };
