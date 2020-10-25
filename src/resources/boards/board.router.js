const router = require('express').Router();
const { BoardSchemaPost, BoardSchemaPut, boards } = require('./board.model');
const boardsService = require('./board.service');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('../../utils/validator');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const dbBoards = await boardsService.getAll();
    res.status(200).send(dbBoards.map(boards.toResponse));
  })
);

router.get(
  '/:boardId',
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    const board = await boardsService.getById(boardId);
    res.status(200).send(boards.toResponse(board));
  })
);

router.post(
  '/',
  [validator(BoardSchemaPost)],
  wrapAsync(async (req, res) => {
    const { title, columns } = req.body;
    const board = await boardsService.create({ title, columns });
    res.status(200).send(boards.toResponse(board));
  })
);

router.put(
  '/:boardId',
  [validator(BoardSchemaPut)],
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    const board = await boardsService.update(boardId, req.body);
    res.status(200).send(boards.toResponse(board));
  })
);

router.delete(
  '/:boardId',
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    await boardsService.remove(boardId);
    res.sendStatus(204);
  })
);

module.exports = router;
