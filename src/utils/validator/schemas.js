const errorMessages = require('../../common/errors/errorMessages.json');

const UserSchemaPut = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 30 },
    login: {
      type: 'string',
      minLength: 4,
      maxLength: 30,
      errorMessage: errorMessages.login_invalid
    },
    email: {
      type: 'string',
      format: 'email',
      errorMessage: errorMessages.email_invalid
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 30,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})',
      errorMessage: {
        type: errorMessages.password_pattern,
        pattern: errorMessages.password_pattern,
        minLength: errorMessages.password_size,
        maxLength: errorMessages.password_size
      }
    }
  }
};

const UserSchemaPost = {
  ...UserSchemaPut,
  required: ['name', 'login', 'password', 'email']
};

const BoardSchemaPut = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    columns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          order: { type: 'integer' }
        }
      }
    }
  }
};

const BoardSchemaPost = {
  ...BoardSchemaPut,
  required: ['title', 'columns']
};

const TaskSchemaPut = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    userId: { oneOf: [{ type: 'string' }, { type: 'null' }] },
    boardId: { oneOf: [{ type: 'string' }, { type: 'null' }] },
    columnId: { oneOf: [{ type: 'string' }, { type: 'null' }] },
    order: { type: 'integer' }
  }
};

const TaskSchemaPost = {
  ...TaskSchemaPut,
  required: ['title', 'description', 'userId', 'boardId', 'order']
};

const LoginSchema = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['login', 'password']
};

module.exports = {
  UserSchemaPost,
  UserSchemaPut,
  BoardSchemaPost,
  BoardSchemaPut,
  TaskSchemaPost,
  TaskSchemaPut,
  LoginSchema
};
