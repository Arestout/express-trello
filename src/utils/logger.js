// Core
const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf } = format;
const logFormat = printf(({ message, timestamp }) => `${timestamp} ${message}`);

const filenameError = path.resolve(path.join('logs', 'unhandled_errors.log'));
const filenameNotFound = path.resolve(
  path.join('logs', 'not_found_errors.log')
);
const filenameValidation = path.resolve(
  path.join('logs', 'validation_errors.log')
);
const filenameRequest = path.resolve(path.join('logs', 'requests.log'));

// Loggers
const errorLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({
      filename: filenameError,
      level: 'error',
      handleExceptions: true,
      handleRejections: true
    }),
    new transports.Console({ handleExceptions: true, handleRejections: true })
  ]
});

const notFoundLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({ filename: filenameNotFound, level: 'error' })
  ]
});

const validationLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({ filename: filenameValidation, level: 'error' })
  ]
});

const requestLogger = createLogger({
  format: combine(timestamp(), logFormat),
  level: 'debug',
  transports: [
    new transports.File({ filename: filenameRequest, level: 'debug' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  const loggers = [validationLogger, notFoundLogger, requestLogger];
  loggers.forEach(logger => logger.add(new transports.Console()));
}

module.exports = {
  errorLogger,
  notFoundLogger,
  validationLogger,
  requestLogger
};
