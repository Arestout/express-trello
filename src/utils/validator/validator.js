const Ajv = require('ajv');
const { ValidationError } = require('../../common/errors');
const { BAD_REQUEST } = require('http-status-codes');

const validator = schema => (req, res, next) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(req.body);

  if (valid) {
    return next();
  }

  const errors = validate.errors.map(({ message }) => message).join(', ');
  const body = JSON.stringify(req.body, null, 2);

  next(
    new ValidationError(
      `${req.method}: ${req.originalUrl} [ ${errors} ]\n${body}`,
      BAD_REQUEST
    )
  );
};

module.exports = validator;
