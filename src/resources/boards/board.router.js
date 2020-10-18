const router = require('express').Router();
const { Board, BoardSchemaPost, BoardSchemaPut } = require('./board.model');
const boardsService = require('./board.service');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('../../utils/validator');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const boards = await boardsService.getAll();
    res.status(200).send(boards);
  })
);

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const board = await boardsService.getById(req.params.id);
    res.status(200).send(board);
  })
);

router.post(
  '/',
  [validator(BoardSchemaPost)],
  wrapAsync(async (req, res) => {
    const { title, columns } = req.body;
    const board = await boardsService.create(new Board({ title, columns }));
    res.status(200).send(board);
  })
);

router.put(
  '/:id',
  [validator(BoardSchemaPut)],
  wrapAsync(async (req, res) => {
    const board = await boardsService.update(req.params.id, req.body);
    res.status(200).send(board);
  })
);

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const board = await boardsService.remove(req.params.id);
    res.status(204).send(board);
  })
);

module.exports = router;
