const mongoose = require('mongoose');
const uuid = require('uuid');

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

const TaskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      default: uuid
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      // required: true,
      default: null
    },
    boardId: {
      type: String,
      // required: true,
      default: null
    },
    columnId: {
      type: String,
      // required: true,
      default: null
    },
    order: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
);

const tasks = mongoose.model('tasks', TaskSchema);

class Task {
  constructor({
    id = uuid(),
    title = 'Task',
    order = 0,
    description = 'Task description',
    userId,
    boardId,
    columnId
  } = {}) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.description = description;
    this.userId = userId;
    this.boardId = boardId;
    this.columnId = columnId;
  }
}

module.exports = { Task, TaskSchemaPost, TaskSchemaPut, tasks };
