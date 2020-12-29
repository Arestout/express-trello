const router = require('express').Router();
const {
  UserSchemaPost,
  UserSchemaPut,
  UserTokenSchema
} = require('../../utils/validator/schemas');
const usersService = require('./user.service');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('../../utils/validator/validator');
const checkEmailAndUser = require('../../utils/validator/checkEmailAndUser');

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
  [validator(UserSchemaPost), checkEmailAndUser],
  wrapAsync(async (req, res) => {
    const user = await usersService.create(req.body);
    res.status(200).send(user);
  })
);

router.post(
  '/token/:token',
  [validator(UserTokenSchema)],
  wrapAsync(async (req, res) => {
    const { token } = req.params;

    await usersService.activate(token);
    res.send({ message: 'Account is activated' });
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
