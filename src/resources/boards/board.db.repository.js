const mongoose = require('mongoose');
const { boards } = require('./board.model');
const { NotFoundError } = require('../../common/errors/notFoundError');
const { CONFLICT } = require('http-status-codes');

const getAll = async () => await boards.find();

const getById = async id => {
  const board = await boards.findOne({ _id: id });

  if (!board) throw new NotFoundError(`The board with id ${id} was not found`);

  return board;
};

const create = async boardData => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  const board = await boards.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId() },
    boardData,
    options
  );
  if (!board) {
    throw new Error('Could not create board', CONFLICT);
  }

  return board;
};

const update = async (id, data) => {
  const query = { _id: id };
  const options = { upsert: false, new: true };

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
