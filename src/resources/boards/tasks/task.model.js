const mongoose = require('mongoose');
const uuid = require('uuid');

const TaskSchema = new mongoose.Schema({
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
});

TaskSchema.method('toJSON', function() {
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

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

module.exports = { Task, tasks };
