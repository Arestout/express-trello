const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

module.exports = hashPassword;
