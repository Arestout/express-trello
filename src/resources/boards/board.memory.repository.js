const DB = require('../../common/DB/boards');

const getAll = async () => await DB.getAllBoards();

const getById = async id => {
  const board = await DB.getBoard(id);

  if (!board) throw new Error(`The board with id ${id} was not found`);

  return board;
};

const create = async board => {
  const newBoard = await DB.createBoard(board);

  if (!newBoard) throw new Error(`Could not create board with id ${board.id}`);

  return newBoard;
};

const update = async (id, data) => {
  const board = await DB.updateBoard(id, data);

  if (!board) throw new Error('Could not update board with id ${id}');

  return board;
};

const remove = async id => {
  const board = await DB.removeBoard(id);

  if (!board) throw new Error('Could not remove board with id ${id}');

  return board;
};

module.exports = { getAll, getById, create, update, remove };
