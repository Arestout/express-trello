const usersRepo = require('../users/user.db.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../common/config');
const { FORBIDDEN } = require('http-status-codes');
const { AuthError } = require('../../common/errors');
const errorMessages = require('../../common/errors/errorMessages.json');

const getToken = async (login, password) => {
  const user = await usersRepo.getByProperty({ login });

  if (!user) {
    throw new AuthError(errorMessages.credentials_invalid, FORBIDDEN);
  }

  if (user.inactive) {
    throw new AuthError(errorMessages.email_not_verified, FORBIDDEN);
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new AuthError(errorMessages.credentials_invalid, FORBIDDEN);
  }

  const token = jwt.sign({ login, id: user._id }, JWT_SECRET_KEY, {
    expiresIn: '10m'
  });

  return token;
};

module.exports = { getToken };
