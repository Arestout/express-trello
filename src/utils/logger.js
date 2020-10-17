// Core
const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf } = format;
const logFormat = printf(({ message, timestamp }) => `${timestamp} ${message}`);

const filenameError = path.resolve(path.join('logs', 'error_errors.log'));
const filenameNotFound = path.resolve(
  path.join('logs', 'not_found_errors.log')
);
const filenameValidation = path.resolve(
  path.join('logs', 'validation_errors.log')
);

console.log(filenameError);
// Loggers
const errorLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({ filename: filenameError, level: 'error' }),
    new transports.Console()
  ]
});

const notFoundLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({ filename: filenameNotFound, level: 'error' }),
    new transports.Console()
  ]
});

const validationLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({ filename: filenameValidation, level: 'error' }),
    new transports.Console()
  ]
});

const requestLogger = createLogger({
  format: combine(timestamp(), logFormat),
  level: 'debug',
  transports: [new transports.Console()]
});

module.exports = {
  errorLogger,
  notFoundLogger,
  validationLogger,
  requestLogger
};
