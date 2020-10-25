const router = require('express').Router();
const { UserSchemaPost, UserSchemaPut, users } = require('./user.model');
const usersService = require('./user.service');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('../../utils/validator');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const dbUsers = await usersService.getAll();
    res.status(200).send(dbUsers.map(users.toResponse));
  })
);

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const user = await usersService.getById(req.params.id);
    res.status(200).send(users.toResponse(user));
  })
);

router.post(
  '/',
  [validator(UserSchemaPost)],
  wrapAsync(async (req, res) => {
    const { login, password, name } = req.body;
    const user = await usersService.create({ login, password, name });
    res.status(200).send(users.toResponse(user));
  })
);

router.put(
  '/:id',
  [validator(UserSchemaPut)],
  wrapAsync(async (req, res) => {
    const user = await usersService.update(req.params.id, req.body);
    res.status(200).send(users.toResponse(user));
  })
);

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await usersService.remove(req.params.id);
    res.sendStatus(204);
  })
);

module.exports = router;
