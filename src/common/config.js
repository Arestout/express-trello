const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../../.env')
});

const config = require('config');

const database = config.get('database');

// dotenv.config({
//   path: path.resolve(__dirname, `../../${process.env.NODE_ENV}.env`)
// });

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_CONNECTION_STRING: database.mongoString,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  AUTH_MODE: process.env.AUTH_MODE === 'true',
  REDIS_HOST: process.env.REDIS_HOST
};
