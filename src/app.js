const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');

const { errorLogger, requestLogger } = require('./utils/logger');
const { NotFoundError } = require('./common/errors/');

const userRouter = require('./resources/users/user.router');
const boardRouter = require('./resources/boards/board.router');
const taskRouter = require('./resources/boards/tasks/task.router');
const errorHandler = require('./utils/errorHandler');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());

// Swagger
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Request Logger
app.use((req, res, next) => {
  const query =
    Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : '';
  let body = null;

  if (req.method !== 'GET') {
    body = JSON.stringify(req.body, null, 2);
  }

  requestLogger.debug(
    `${req.method} ${req.url} | Query: ${query} | ${
      body ? `\nBody: ${body}` : ''
    }`
  );
  next();
});
// Routes
app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', userRouter);
app.use('/boards', boardRouter);
boardRouter.use('/:boardId/tasks', taskRouter);

app.use('*', (req, res, next) => {
  const error = new NotFoundError(
    `Can not find right route for method ${req.method} and path ${req.originalUrl}`
  );
  next(error);
});

app.use(errorHandler);

process
  .on('unhandledRejection', reason => {
    errorLogger.error('Unhandled Rejection at Promise: ', reason);
  })
  .on('uncaughtException', err => {
    errorLogger.error('Uncaught Exception thrown: ', err);
  });

// throw Error('Oops!');
// Promise.reject(Error('Oops! Promise!'));

module.exports = app;
