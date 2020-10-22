const mongoose = require('mongoose');
const uuid = require('uuid');

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

const BoardSchema = new mongoose.Schema(
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
  },
  { versionKey: false }
);

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

module.exports = { Board, BoardSchemaPost, BoardSchemaPut, boards };
