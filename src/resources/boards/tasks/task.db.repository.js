const { tasks } = require('./task.model');
const { NotFoundError } = require('../../../common/errors/notFoundError');

const getAll = async boardId => {
  const boardTasks = await tasks
    .find({ boardId })
    .select('-_id')
    .lean();

  if (boardTasks.length === 0) {
    throw new NotFoundError(`The task with id ${boardId} was not found`);
  }

  return boardTasks;
};

const getById = async id => {
  const task = await tasks
    .findOne({ id })
    .select('-_id')
    .lean();

  if (!task) throw new NotFoundError(`The task with id ${id} was not found`);

  return task;
};

const create = async taskData => {
  const newTask = await tasks.create(taskData);

  if (!newTask) {
    throw new NotFoundError(`Could not create task with id ${taskData.id}`);
  }

  const { id, title, order, description, userId, boardId, columnId } = newTask;
  const task = { id, title, order, description, userId, boardId, columnId };

  return task;
};

const update = async (id, data) => {
  const query = { id };
  const options = { upsert: false, new: true };
  const task = await tasks
    .findOneAndUpdate(query, data, options)
    .select('-_id')
    .lean();

  if (!task) throw new NotFoundError(`Could not update task with id ${id}`);

  return task;
};

const remove = async id => {
  const task = await tasks
    .deleteOne({ id })
    .select('-_id')
    .lean();

  if (!task) throw new NotFoundError(`Could not remove task with id ${id}`);

  return task;
};

const removeTasksByBoardId = async boardId => {
  await tasks.deleteMany({ boardId });
};

const updateTasksUser = async userId => {
  const query = { userId };
  const data = { userId: null };
  const options = { upsert: false, new: true };
  await tasks
    .updateMany(query, data, options)
    .select('-_id')
    .lean();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  removeTasksByBoardId,
  updateTasksUser
};
