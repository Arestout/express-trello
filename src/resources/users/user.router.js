const router = require('express').Router();
const { User, UserSchemaPost, UserSchemaPut } = require('./user.model');
const usersService = require('./user.service');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('../../utils/validator');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const users = await usersService.getAll();
    res.status(200).send(users.map(User.toResponse));
  })
);

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const user = await usersService.getById(req.params.id);
    res.status(200).send(User.toResponse(user));
  })
);

router.post(
  '/',
  [validator(UserSchemaPost)],
  wrapAsync(async (req, res) => {
    const { login, password, name } = req.body;
    const user = await usersService.create(new User({ login, password, name }));
    res.status(200).send(User.toResponse(user));
  })
);

router.put(
  '/:id',
  [validator(UserSchemaPut)],
  wrapAsync(async (req, res) => {
    const user = await usersService.update(req.params.id, req.body);
    res.status(200).send(User.toResponse(user));
  })
);

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const user = await usersService.remove(req.params.id);
    res.status(204).send(User.toResponse(user));
  })
);

module.exports = router;
