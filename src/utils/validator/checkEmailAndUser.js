const userService = require('../../resources/users/user.service');
const errorMessages = require('../../common/errors/errorMessages');
const { ValidationError } = require('../../common/errors');
const { BAD_REQUEST } = require('http-status-codes');

const checkIfEmailInUse = async (email, errors) => {
  const userWithEmail = await userService.getByProperty({ email });

  if (userWithEmail) {
    errors.email = errors.email
      ? `${errors.email}. ${errorMessages.email_in_use}`
      : `${errorMessages.email_in_use}`;

    return true;
  }

  return false;
};

const checkIfLoginInUse = async (login, errors) => {
  const userWithLogin = await userService.getByProperty({ login });

  if (userWithLogin) {
    errors.login = errors.login
      ? `${errors.login}. ${errorMessages.login_in_use}`
      : `${errorMessages.login_in_use}`;

    return true;
  }

  return false;
};

const checkEmailAndUser = async (req, res, next) => {
  const { email, login } = req.body;

  const { errors } = req;

  await Promise.all([
    checkIfEmailInUse(email, errors),
    checkIfLoginInUse(login, errors)
  ]);

  if (Object.keys(errors).length) {
    return next(new ValidationError(errors, BAD_REQUEST));
  }

  next();
};

module.exports = checkEmailAndUser;
