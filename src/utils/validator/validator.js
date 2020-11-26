const Ajv = require('ajv');
const { ValidationError } = require('../../common/errors');
const { BAD_REQUEST } = require('http-status-codes');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-errors')(ajv);

const validator = schema => async (req, res, next) => {
  const validate = ajv.compile(schema);
  const valid = validate(req.body);

  const errors = {};

  if (valid) {
    req.errors = errors;
    return next();
  }

  validate.errors.forEach(
    ({ dataPath, message }) => (errors[dataPath.slice(1)] = message)
  );

  if (req.method === 'POST' && req.url === '/') {
    req.errors = errors;
    return next();
  }

  next(new ValidationError(errors, BAD_REQUEST));
};

module.exports = validator;
