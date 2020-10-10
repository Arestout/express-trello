const User = require('../../resources/users/user.model');
const Board = require('../../resources/boards/board.model');

const DB = {
  users: [],
  boards: [],
  tasks: []
};

DB.users.push(new User(), new User(), new User());
DB.boards.push(new Board(), new Board(), new Board());

module.exports = { DB };
