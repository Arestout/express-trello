const { User, users } = require('../../../resources/users/user.model');
const { Board, boards } = require('../../../resources/boards/board.model');
const { Task, tasks } = require('../../../resources/boards/tasks/task.model');
const mongoose = require('mongoose');

const DB = {
  users: [],
  boards: [],
  tasks: []
};

DB.users.push(
  new User(),
  new User(),
  new User({
    name: 'string',
    email: 'string@mail.com',
    login: 'string',
    password: 'string',
    activationToken: 'string'
  }),
  new User({
    name: 'admin',
    email: 'admin@mail.com',
    login: 'admin',
    password: 'admin',
    activationToken: 'admin'
  })
);
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
  await Promise.all(DB.users.map(user => users.create(user)));
  await boards.insertMany(DB.boards);
  await tasks.insertMany(DB.tasks);
})();

module.exports = { DB };
