const router = require('express').Router();
const {
  UserSchemaPost,
  UserSchemaPut
} = require('../../utils/validator/schemas');
const usersService = require('./user.service');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('../../utils/validator/validator');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const users = await usersService.getAll();
    res.status(200).send(users);
  })
);

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const user = await usersService.getById(req.params.id);
    res.status(200).send(user);
  })
);

router.post(
  '/',
  [validator(UserSchemaPost)],
  wrapAsync(async (req, res) => {
    const { login, password, name } = req.body;
    const user = await usersService.create({ login, password, name });
    res.status(200).send(user);
  })
);

router.put(
  '/:id',
  [validator(UserSchemaPut)],
  wrapAsync(async (req, res) => {
    const user = await usersService.update(req.params.id, req.body);
    res.status(200).send(user);
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
