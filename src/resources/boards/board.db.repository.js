const { boards } = require('./board.model');
const { NotFoundError } = require('../../common/errors/notFoundError');

const getAll = async () => await boards.find();

const getById = async id => {
  const board = await boards.findOne({ _id: id });

  if (!board) throw new NotFoundError(`The board with id ${id} was not found`);

  return board;
};

const create = async boardData => {
  const board = await boards.create(boardData);

  return board;
};

const update = async (id, data) => {
  const query = { _id: id };
  const options = { upsert: false, new: true, runValidators: true };

  const board = await boards.findOneAndUpdate(query, data, options);

  if (!board) throw new NotFoundError(`Could not update board with id ${id}`);

  return board;
};

const remove = async id => {
  const board = await boards.findOneAndDelete({ _id: id });

  if (!board) throw new NotFoundError(`Could not remove board with id ${id}`);

  return board;
};

module.exports = { getAll, getById, create, update, remove };
