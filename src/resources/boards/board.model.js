const mongoose = require('mongoose');
const uuid = require('uuid');
const { tasks } = require('./tasks/task.model');

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  columns: [
    {
      title: {
        type: String,
        required: true
      },
      order: {
        type: Number,
        required: true
      }
    }
  ]
});

BoardSchema.method('toJSON', function() {
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

BoardSchema.post('findOneAndDelete', async (doc, next) => {
  await tasks.deleteMany({ boardId: doc._id });
  next();
});

const boards = mongoose.model('boards', BoardSchema);

class Board {
  constructor({
    id = uuid(),
    title = 'Board',
    columns = [
      {
        id: uuid(),
        title: 'Column Title',
        order: 0
      },
      {
        id: uuid(),
        title: 'Column Title',
        order: 1
      },
      {
        id: uuid(),
        title: 'Column Title',
        order: 2
      }
    ]
  } = {}) {
    this.id = id;
    this.title = title;
    this.columns = columns;
  }
}

module.exports = { Board, boards };
