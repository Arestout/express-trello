const router = require('express').Router();
const authService = require('./auth.service');
const wrapAsync = require('../../utils/wrapAsync');
const { OK } = require('http-status-codes');
const validator = require('../../utils/validator/validator');
const { LoginSchema } = require('../../utils/validator/schemas');

router.post(
  '/',
  [validator(LoginSchema)],
  wrapAsync(async (req, res) => {
    const { login, password } = req.body;
    const token = await authService.getToken(login, password);

    res.status(OK).send({ token });
  })
);

module.exports = router;
