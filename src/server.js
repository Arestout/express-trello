const { PORT } = require('./common/config');
const app = require('./app');
const DB = require('./common/DB/inMemoryDb/inMemoryDb');
const connectToDB = require('./common/DB/db');

let server;

connectToDB(() => {
  server = app.listen(PORT, () =>
    console.log(`App is running on http://localhost:${PORT}`)
  );
});

module.exports = server;
