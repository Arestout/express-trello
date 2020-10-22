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
    const reqBody = { ...req.body };
    reqBody.password && (reqBody.password = maskPassword(reqBody.password));

    body = JSON.stringify(reqBody, null, 2);
  }

  requestLogger.info(
    `${req.method} ${req.url} | Query: ${query} | ${
      body ? `\nBody: ${body}` : ''
    }`
  );
  next();
};

module.exports = requestLoggerHandler;
