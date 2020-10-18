const { notFoundLogger, validationLogger, errorLogger } = require('../logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const { name, message, statusCode } = error;
  const errorMessage = `${name}: ${message}`;

  switch (error.name) {
    case 'NotFoundError':
      notFoundLogger.error(errorMessage);
      break;

    case 'ValidationError':
      validationLogger.error(errorMessage);
      break;

    default:
      errorLogger.error(errorMessage);
      break;
  }

  const status = statusCode ? statusCode : 500;
  res.status(status).send({ message });
};

module.exports = errorHandler;
