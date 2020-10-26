const { NOT_FOUND } = require('http-status-codes');

class NotFoundError extends Error {
  constructor(...args) {
    super(...args);
    const [, statusCode = NOT_FOUND] = args;

    Error.captureStackTrace(this, NotFoundError);
    this.name = 'NotFoundError';
    this.statusCode = statusCode;
  }
}

module.exports = { NotFoundError };
