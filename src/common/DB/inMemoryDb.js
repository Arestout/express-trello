const { User, users } = require('../../resources/users/user.model');
const { Board, boards } = require('../../resources/boards/board.model');
const { Task, tasks } = require('../../resources/boards/tasks/task.model');
const mongoose = require('mongoose');

const DB = {
  users: [],
  boards: [],
  tasks: []
};

DB.users.push(new User(), new User(), new User());
DB.boards.push(new Board(), new Board(), new Board());

const addTasks = () => {
  for (let i = 0; i <= 2; i++) {
    DB.tasks.push(
      new Task({
        title: `Task ${i}`,
        order: i,
        description: 'Task description',
        userId: DB.users[i].id,
        boardId: DB.boards[i].id,
        columnId: DB.boards[i].columns[i].id
      })
    );
  }
};

addTasks();

(async () => {
  mongoose.connection.dropDatabase();
  await users.insertMany(DB.users);
  await boards.insertMany(DB.boards);
  await tasks.insertMany(DB.tasks);
})();

module.exports = { DB };
