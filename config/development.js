module.exports = {
  database: {
    mongoString: process.env.MONGO_CONNECTION_STRING
  },
  mail: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.DEV_EMAIL_USER,
      pass: process.env.DEV_EMAIL_PASS
    }
  }
};
