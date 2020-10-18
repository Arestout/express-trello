const { requestLogger } = require('../logger');

const maskPassword = value => {
  const maskedPassword = '*';
  return maskedPassword.repeat(value.length);
};

const requestLoggerHandler = (req, res, next) => {
  const query =
    Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : '';
  let body = null;

  if (req.method !== 'GET') {
    req.body.password && (req.body.password = maskPassword(req.body.password));

    body = JSON.stringify(req.body, null, 2);
  }

  requestLogger.debug(
    `${req.method} ${req.url} | Query: ${query} | ${
      body ? `\nBody: ${body}` : ''
    }`
  );
  next();
};

module.exports = requestLoggerHandler;
