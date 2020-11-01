const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../common/config');
const { UNAUTHORIZED } = require('http-status-codes');
const { AuthError } = require('../../common/errors');

const authorize = async (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return next(new AuthError('Token not found', UNAUTHORIZED));
  }

  const [tokenType, token] = headerToken.split(' ');

  if (tokenType !== 'Bearer') {
    return next(new AuthError('Wrong authorization method', UNAUTHORIZED));
  }

  if (!token) {
    return next(new AuthError('Token not found', UNAUTHORIZED));
  }

  jwt.verify(token, JWT_SECRET_KEY, err => {
    if (err) {
      return next(new AuthError('Credentials are not valid', UNAUTHORIZED));
    }

    return next();
  });
};

module.exports = authorize;
