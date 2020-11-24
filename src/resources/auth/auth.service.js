const usersRepo = require('../users/user.db.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../common/config');
const { FORBIDDEN } = require('http-status-codes');
const { AuthError } = require('../../common/errors');

const getToken = async (login, password) => {
  const user = await usersRepo.getByProperty({ login });

  if (!user) {
    throw new AuthError('Credentials are not valid', FORBIDDEN);
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new AuthError('Credentials are not valid', FORBIDDEN);
  }

  const token = jwt.sign({ login, id: user._id }, JWT_SECRET_KEY, {
    expiresIn: '10m'
  });

  return token;
};

module.exports = { getToken };
