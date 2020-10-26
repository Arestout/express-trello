const { notFoundLogger, validationLogger, errorLogger } = require('../logger');
const {
  INTERNAL_SERVER_ERROR,
  getStatusText,
  BAD_REQUEST
} = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const { name, message } = error;
  let { statusCode } = error;
  const errorMessage = `${name}: ${message}`;

  switch (error.name) {
    case 'NotFoundError':
      notFoundLogger.error(errorMessage);
      break;

    case 'ValidationError':
      validationLogger.error(errorMessage);
      statusCode = BAD_REQUEST;
      break;

    default:
      errorLogger.error(errorMessage);
      break;
  }

  if (statusCode) {
    res.status(statusCode).send({ message });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).send(getStatusText(INTERNAL_SERVER_ERROR));
};

module.exports = errorHandler;
