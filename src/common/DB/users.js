const { DB } = require('./inMemoryDb');
const { User } = require('../../resources/users/user.model');

const getAllUsers = async () => {
  return DB.users.slice(0);
};

const getUser = async id => DB.users.filter(user => user.id === id)[0];

const createUser = async user => {
  DB.users.push(user);
  return user;
};

const updateUser = async (id, data) => {
  let index = null;
  const user = DB.users.find((userItem, userIndex) => {
    if (userItem.id === id) {
      index = userIndex;
      return userItem;
    }
  });
  if (user) {
    const newUser = new User({ ...user, ...data });
    DB.users.splice(index, 1, newUser);
    return newUser;
  }

  return null;
};

const removeUser = async id => {
  const userIndex = DB.users.findIndex(user => user.id === id);

  let deletedUser = null;
  if (userIndex !== -1) {
    deletedUser = DB.users.splice(userIndex, 1)[0];
  }

  return deletedUser;
};

module.exports = { getAllUsers, getUser, createUser, updateUser, removeUser };
