const { BAD_REQUEST } = require('http-status-codes');

class ValidationError extends Error {
  constructor(...args) {
    super(...args);
    const [message, statusCode = BAD_REQUEST] = args;

    Error.captureStackTrace(this, ValidationError);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = { ValidationError };
