const { boards } = require('./board.model');
const { NotFoundError } = require('../../common/errors/notFoundError');

const getAll = async () => await boards.find().lean();

const getById = async id => {
  const board = await boards.findOne({ id }).lean();

  if (!board) throw new NotFoundError(`The board with id ${id} was not found`);

  return board;
};

const create = async boardData => {
  const newBoard = await boards.create(boardData);

  if (!newBoard) {
    throw new Error(`Could not create board with id ${boardData.id}`);
  }

  const { id, title, columns } = newBoard;
  const board = { id, title, columns };

  return board;
};

const update = async (id, data) => {
  const query = { id };
  const options = { upsert: false, new: true };
  const board = await boards.findOneAndUpdate(query, data, options).lean();

  if (!board) throw new NotFoundError(`Could not update board with id ${id}`);

  return board;
};

const remove = async id => {
  const board = await boards
    .deleteOne({ id })
    .select('-_id')
    .lean();

  if (!board) throw new NotFoundError(`Could not remove board with id ${id}`);

  return board;
};

module.exports = { getAll, getById, create, update, remove };
