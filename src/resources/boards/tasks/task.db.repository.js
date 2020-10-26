const mongoose = require('mongoose');
const { tasks } = require('./task.model');
const { NotFoundError } = require('../../../common/errors/notFoundError');
const { CONFLICT } = require('http-status-codes');

const getAll = async boardId => {
  const boardTasks = await tasks.find({ boardId });

  if (boardTasks.length === 0) {
    throw new NotFoundError(`The task with id ${boardId} was not found`);
  }

  return boardTasks;
};

const getById = async id => {
  const task = await tasks.findOne({ _id: id });

  if (!task) throw new NotFoundError(`The task with id ${id} was not found`);

  return task;
};

const create = async taskData => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  const task = await tasks.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId() },
    taskData,
    options
  );
  if (!task) {
    throw new Error('Could not create task', CONFLICT);
  }

  return task;
};

const update = async (id, data) => {
  const query = { _id: id };
  const options = { upsert: false, new: true };
  const task = await tasks.findOneAndUpdate(query, data, options);

  if (!task) throw new NotFoundError(`Could not update task with id ${id}`);

  return task;
};

const remove = async id => {
  const task = await tasks.deleteOne({ _id: id });

  if (!task) throw new NotFoundError(`Could not remove task with id ${id}`);

  return task;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
