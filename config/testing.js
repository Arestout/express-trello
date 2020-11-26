module.exports = {
  database: {
    mongoString: process.env.MONGO_CONNECTION_STRING_TEST
  },
  mail: {
    host: 'localhost',
    port: Math.floor(Math.random() * 2000) + 10000,
    tls: {
      rejectUnauthorized: false
    }
  }
};
