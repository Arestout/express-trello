const { DB } = require('./inMemoryDb');
const { Board } = require('../../../resources/boards/board.model');

const getAllBoards = async () => DB.boards.slice(0);

const getBoard = async id => DB.boards.filter(board => board.id === id)[0];

const createBoard = async board => {
  DB.boards.push(board);

  return board;
};

const updateBoard = async (id, data) => {
  let index = null;
  const board = DB.boards.find((boardItem, boardIndex) => {
    if (boardItem.id === id) {
      index = boardIndex;
      return boardItem;
    }
  });
  if (board) {
    const newBoard = new Board({ ...board, ...data });
    DB.boards.splice(index, 1, newBoard);
    return newBoard;
  }

  return null;
};

const removeBoard = async id => {
  const boardIndex = DB.boards.findIndex(board => board.id === id);

  let deletedBoard = null;
  if (boardIndex !== -1) {
    deletedBoard = DB.boards.splice(boardIndex, 1)[0];
  }

  return deletedBoard;
};

module.exports = {
  getAllBoards,
  getBoard,
  createBoard,
  updateBoard,
  removeBoard
};
