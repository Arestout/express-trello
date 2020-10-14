const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');

const requestLogger = require('./common/loggers/requestLogger');
const errorLogger = require('./common/loggers/errorLogger');
const notFoundLogger = require('./common/loggers/notFoundLogger');
const validationLogger = require('./common/loggers/validationLogger');
const { NotFoundError } = require('./common/errors/notFoundError');

const userRouter = require('./resources/users/user.router');
const boardRouter = require('./resources/boards/board.router');
const taskRouter = require('./resources/boards/tasks/task.router');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());
// Swagger
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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

// Error Logger
if (process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
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
    res.status(status).json({ message });
  });
}

// Request Logger
app.use((req, res, next) => {
  const query = Object.keys(req.query) > 0 ? JSON.stringify(req.query) : '';
  let body = null;

  if (req.method !== 'GET') {
    body = JSON.stringify(req.body, null, 2);
  }
  console.log(req.query);

  requestLogger.debug(
    `${req.method} ${req.url} ${query} ${body ? `\n${body}` : ''}`
  );
  next();
});

process
  .on('unhandledRejection', (reason, p) => {
    errorLogger.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    errorLogger.error(err, 'Uncaught Exception thrown');
  });

module.exports = app;
