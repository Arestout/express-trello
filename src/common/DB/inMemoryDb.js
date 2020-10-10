const User = require('../../resources/users/user.model');

const DB = {
  users: [],
  boards: [],
  tasks: []
};

DB.users.push(new User(), new User(), new User());
module.exports = { DB };
