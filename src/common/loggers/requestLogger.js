const { format, createLogger, transports } = require('winston');

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const requestLogger = createLogger({
  format: combine(timestamp(), logFormat),
  level: 'debug',
  transports: [new transports.Console()]
});

module.exports = requestLogger;
