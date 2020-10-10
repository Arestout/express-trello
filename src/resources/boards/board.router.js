const router = require('express').Router();
const Board = require('./board.model');
const boardsService = require('./board.service');

router.route('/').get(async (req, res) => {
  try {
    const boards = await boardsService.getAll();
    res.status(200).send(boards);
  } catch (err) {
    res.status(404).send('Boards not found');
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const board = await boardsService.getById(req.params.id);
    res.status(200).send(board);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.route('/').post(async (req, res) => {
  try {
    const { title, columns } = req.body;
    const board = await boardsService.create(new Board({ title, columns }));
    res.status(200).send(board);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/:id').put(async (req, res) => {
  try {
    const board = await boardsService.update(req.params.id, req.body);
    res.status(200).send(board);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/:id').delete(async (req, res) => {
  try {
    const board = await boardsService.remove(req.params.id);

    res.status(204).send(board);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
