const router = require('express').Router({ mergeParams: true });
const { Task, TaskSchemaPost, TaskSchemaPut } = require('./task.model');
const tasksService = require('./task.service');
const wrapAsync = require('../../../utils/wrapAsync');
const validator = require('../../../utils/validator');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const tasks = await tasksService.getAll(req.params.boardId);
    res.status(200).send(tasks);
  })
);

router.get(
  '/:taskId',
  wrapAsync(async (req, res) => {
    const task = await tasksService.getById(req.params.taskId);
    res.status(200).send(task);
  })
);

router.post(
  '/',
  [validator(TaskSchemaPost)],
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    const { title, description, order, userId, columnId } = req.body;
    const task = await tasksService.create(
      new Task({ title, description, order, userId, columnId, boardId })
    );
    res.status(200).send(task);
  })
);

router.put(
  '/:taskId',
  [validator(TaskSchemaPut)],
  wrapAsync(async (req, res) => {
    const task = await tasksService.update(req.params.taskId, req.body);
    res.status(200).send(task);
  })
);

router.delete(
  '/:taskId',
  wrapAsync(async (req, res) => {
    const { taskId } = req.params;
    await tasksService.remove(taskId);
    res.status(204).send('OK');
  })
);

module.exports = router;
