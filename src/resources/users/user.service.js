const mongoose = require('mongoose');
const emailService = require('../../utils/email/emailService');
const errorMessages = require('../../common/errors/errorMessages');
const createError = require('http-errors');

const usersRepo = require('./user.db.repository');
const tasksRepo = require('../boards/tasks/task.db.repository');
const {
  generateRandomString
} = require('../../utils/auth/generateRandomString');

const getAll = () => usersRepo.getAll();

const getById = id => usersRepo.getById(id);

const getByProperty = entry => usersRepo.getByProperty(entry);

const create = async user => {
  const { login, password, email, name } = user;
  const randomString = generateRandomString(16);
  const userDTO = {
    login,
    password,
    email,
    name,
    activationToken: randomString
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  const savedUser = await usersRepo.create(userDTO, session);

  try {
    await emailService.sendAccountActivation(email, userDTO.activationToken);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new createError.BadGateway(errorMessages.email_failure);
  } finally {
    session.endSession();
  }

  return savedUser;
};

const update = (id, user) => usersRepo.update(id, user);

const remove = async userId => {
  const user = await usersRepo.remove(userId);
  await tasksRepo.updateTasksUser(user.id);

  return user;
};

const activate = token => usersRepo.activate(token);

module.exports = {
  getAll,
  getById,
  getByProperty,
  create,
  update,
  remove,
  activate
};
