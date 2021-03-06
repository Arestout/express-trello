const router = require('express').Router();
const {
  BoardSchemaPost,
  BoardSchemaPut
} = require('../../utils/validator/schemas');
const boardsService = require('./board.service');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('../../utils/validator/validator');
const {
  cache,
  setCache,
  updateCache,
  deleteCache
} = require('../../utils/cache/cache');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const boards = await boardsService.getAll();
    res.status(200).send(boards);
  })
);

router.get(
  '/:boardId',
  [cache],
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    const board = await boardsService.getById(boardId);
    await setCache(boardId, board);
    res.status(200).send(board);
  })
);

router.post(
  '/',
  [validator(BoardSchemaPost)],
  wrapAsync(async (req, res) => {
    const { title, columns } = req.body;
    const board = await boardsService.create({ title, columns });
    res.status(200).send(board);
  })
);

router.put(
  '/:boardId',
  [validator(BoardSchemaPut)],
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    const board = await boardsService.update(boardId, req.body);
    await updateCache(boardId, board);
    res.status(200).send(board);
  })
);

router.delete(
  '/:boardId',
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    await boardsService.remove(boardId);
    await deleteCache(boardId);
    res.sendStatus(204);
  })
);

module.exports = router;
