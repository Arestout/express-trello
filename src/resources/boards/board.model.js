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

module.exports = { Board, BoardSchemaPost, BoardSchemaPut };
