const router = require('express').Router({ mergeParams: true });
const {
  TaskSchemaPost,
  TaskSchemaPut
} = require('../../../utils/validator/schemas');
const tasksService = require('./task.service');
const wrapAsync = require('../../../utils/wrapAsync');
const validator = require('../../../utils/validator/validator');
const {
  cache,
  setCache,
  updateCache,
  deleteCache
} = require('../../../utils/cache/cache');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const tasks = await tasksService.getAll(req.params.boardId);
    res.status(200).send(tasks);
  })
);

router.get(
  '/:taskId',
  [cache],
  wrapAsync(async (req, res) => {
    const { taskId } = req.params;
    const task = await tasksService.getById(taskId);
    await setCache(taskId, task);
    res.status(200).send(task);
  })
);

router.post(
  '/',
  [validator(TaskSchemaPost)],
  wrapAsync(async (req, res) => {
    const { boardId } = req.params;
    const task = await tasksService.create({ ...req.body, boardId });
    res.status(200).send(task);
  })
);

router.put(
  '/:taskId',
  [validator(TaskSchemaPut)],
  wrapAsync(async (req, res) => {
    const { taskId } = req.params;
    const task = await tasksService.update(taskId, req.body);
    await updateCache(taskId, task);
    res.status(200).send(task);
  })
);

router.delete(
  '/:taskId',
  wrapAsync(async (req, res) => {
    const { taskId } = req.params;
    await tasksService.remove(taskId);
    await deleteCache(taskId);
    res.sendStatus(204);
  })
);

module.exports = router;
