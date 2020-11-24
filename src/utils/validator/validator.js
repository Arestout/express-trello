const Ajv = require('ajv');
const { ValidationError } = require('../../common/errors');
const { BAD_REQUEST } = require('http-status-codes');
const { checkIfEmailInUse, checkIfLoginInUse } = require('./checkEmailAndUser');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-errors')(ajv);

const validator = schema => async (req, res, next) => {
  const validate = ajv.compile(schema);
  const valid = validate(req.body);

  const errors = {};
  const { email, login } = req.body;

  if (valid) {
    const [isEmailInUse, isLoginInUse] = await Promise.all([
      checkIfEmailInUse(email, errors),
      checkIfLoginInUse(login, errors)
    ]);

    if (isEmailInUse || isLoginInUse) {
      return next(new ValidationError(errors, BAD_REQUEST));
    }

    return next();
  }

  validate.errors.forEach(
    ({ dataPath, message }) => (errors[dataPath.slice(1)] = message)
  );

  await Promise.all([
    checkIfEmailInUse(email, errors),
    checkIfLoginInUse(login, errors)
  ]);

  next(new ValidationError(errors, BAD_REQUEST));
};

module.exports = validator;
