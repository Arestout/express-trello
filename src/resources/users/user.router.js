const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');

router.route('/').get(async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.status(200).send(users.map(User.toResponse));
  } catch (err) {
    res.status(404).send('Users not found');
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);
    res.status(200).send(User.toResponse(user));
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.route('/').post(async (req, res) => {
  try {
    const { login, password, name } = req.body;
    const user = await usersService.create(new User({ login, password, name }));
    res.status(200).send(User.toResponse(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/:id').put(async (req, res) => {
  try {
    const user = await usersService.update(req.params.id, req.body);
    res.status(200).send(User.toResponse(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/:id').delete(async (req, res) => {
  try {
    const user = await usersService.remove(req.params.id);
    res.status(204).send(User.toResponse(user));
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
