const { PORT } = require('./common/config');
const app = require('./app');
const DB = require('./common/DB/inMemoryDb');
const connectToDB = require('./common/DB/db');

connectToDB(() => {
  app.listen(PORT, () =>
    console.log(`App is running on http://localhost:${PORT}`)
  );
});
