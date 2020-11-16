const { tasks } = require('./task.model');
const { NotFoundError } = require('../../../common/errors/notFoundError');

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
  const task = await tasks.create(taskData);

  return task;
};

const update = async (id, data) => {
  const query = { _id: id };
  const options = { upsert: false, new: true, runValidators: true };
  const task = await tasks.findOneAndUpdate(query, data, options);

  if (!task) throw new NotFoundError(`Could not update task with id ${id}`);

  return task;
};

const updateTasksUser = async userId =>
  await tasks.updateMany({ userId }, { $set: { userId: null } });

const remove = async id => {
  const task = await tasks.deleteOne({ _id: id });

  if (!task) throw new NotFoundError(`Could not remove task with id ${id}`);

  return task;
};

const removeTasksByBoardId = async boardId =>
  await tasks.deleteMany({ boardId });

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  removeTasksByBoardId,
  updateTasksUser
};
