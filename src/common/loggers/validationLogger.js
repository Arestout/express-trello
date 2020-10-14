// Core
const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf } = format;
const logFormat = printf(({ message, timestamp }) => `${timestamp} ${message}`);
const filename = path.resolve(path.join('logs', 'validation_errors.log'));

const validationLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [new transports.File({ filename, level: 'error' })]
});

module.exports = validationLogger;
