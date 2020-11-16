const { FORBIDDEN } = require('http-status-codes');

class AuthError extends Error {
  constructor(...args) {
    super(...args);
    const [, statusCode = FORBIDDEN] = args;

    Error.captureStackTrace(this, AuthError);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

module.exports = { AuthError };
