const { DB } = require('./inMemoryDb');

const getAllTasks = async id => {
  try {
    const tasks = DB.tasks.filter(task => task.boardId === id);

    return tasks;
  } catch (error) {
    console.log(error.message);
  }
};

const getTask = async id => {
  try {
    const task = DB.tasks.find(taskItem => taskItem.id === id);

    return task;
  } catch (error) {
    console.log(error.message);
  }
};

const createTask = async task => {
  try {
    DB.tasks.push(task);

    return task;
  } catch (error) {
    console.log(error.message);
  }
};

const updateTask = async (id, data) => {
  try {
    let index = null;
    const task = DB.tasks.find((taskItem, taskIndex) => {
      if (taskItem.id === id) {
        index = taskIndex;
        return taskItem;
      }
    });
    if (task) {
      const newTask = { ...task, ...data };
      DB.tasks.splice(index, 1, newTask);
      return newTask;
    }

    return null;
  } catch (error) {
    console.log(error.message);
  }
};

const removeTask = async id => {
  try {
    const taskIndex = DB.tasks.findIndex(task => task.id === id);

    let deletedTask = null;
    if (taskIndex !== -1) {
      deletedTask = DB.tasks.splice(taskIndex, 1)[0];
    }

    return deletedTask;
  } catch (error) {
    console.log(error.message);
  }
};

const removeTasksByBoardId = async boardId => {
  try {
    const tasks = DB.tasks.filter(task => {
      return task.boardId === boardId;
    });
    if (tasks.length === 0) return;
    tasks.forEach(task => removeTask(task.id));
  } catch (error) {
    console.log(error.message);
  }
};

const updateTasksUser = async userId => {
  try {
    const tasks = DB.tasks.filter(task => task.userId === userId);
    if (tasks.length === 0) return;
    tasks.forEach(task => (task.userId = null));
    return;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  removeTask,
  removeTasksByBoardId,
  updateTasksUser
};
