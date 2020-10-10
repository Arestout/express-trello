const router = require('express').Router();
const Task = require('./task.model');
const tasksService = require('./task.service');

router.route('/:boardId/tasks').get(async (req, res) => {
  try {
    const tasks = await tasksService.getAll(req.params.boardId);
    res.status(200).send(tasks);
  } catch (err) {
    res.status(404).send('Tasks not found');
  }
});

router.route('/:boardId/tasks/:taskId').get(async (req, res) => {
  try {
    const task = await tasksService.getById(req.params.taskId);
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.route('/:boardId/tasks').post(async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, order, userId, columnId } = req.body;
    const task = await tasksService.create(
      new Task({ title, description, order, userId, columnId, boardId })
    );

    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/:boardId/tasks/:taskId').put(async (req, res) => {
  try {
    const task = await tasksService.update(req.params.taskId, req.body);
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/:boardId/tasks/:taskId').delete(async (req, res) => {
  try {
    const task = await tasksService.remove(req.params.taskId);
    res.status(204).send(task);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
