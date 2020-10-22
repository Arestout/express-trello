// Core
const mongoose = require('mongoose');

const connectToDB = cb => {
  const { MONGO_CONNECTION_STRING } = process.env;

  const mongooseOptions = {
    promiseLibrary: global.Promise,
    poolSize: 50,
    keepAlive: 30000,
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: false
  };

  mongoose.connect(MONGO_CONNECTION_STRING, mongooseOptions);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('DB connected');
    cb();
  });
};

module.exports = connectToDB;
