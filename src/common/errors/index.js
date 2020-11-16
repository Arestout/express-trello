const { NotFoundError } = require('./notFoundError');
const { ValidationError } = require('./validationError');
const { AuthError } = require('./authError');

module.exports = { NotFoundError, ValidationError, AuthError };
