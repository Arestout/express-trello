const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const helmet = require('helmet');

const { NotFoundError } = require('./common/errors/');

const authRouter = require('./resources/auth/auth.router');
const userRouter = require('./resources/users/user.router');
const boardRouter = require('./resources/boards/board.router');
const taskRouter = require('./resources/boards/tasks/task.router');

const errorHandler = require('./utils/handlers/errorHandler');
const requestLoggerHandler = require('./utils/handlers/requestLoggerHandler');
const authorize = require('./utils/auth/authorize');

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(helmet());
app.use(express.json());

// Swagger
if (process.env.NODE_ENV === 'development') {
  app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
}

// Request Logger
app.use(requestLoggerHandler);

// Routes
app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/login', authRouter);
app.use(authorize);
app.use('/users', userRouter);
app.use('/boards', boardRouter);
boardRouter.use('/:boardId/tasks', taskRouter);

app.use('*', (req, res, next) => {
  const error = new NotFoundError(
    `Can not find right route for method ${req.method} and path ${req.originalUrl}`
  );
  next(error);
});

// Error Handler
app.use(errorHandler);

module.exports = app;
