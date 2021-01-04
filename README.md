# Trello clone REST API

**Used services:**

- Express
- MongoDB
- Redis
- Docker

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm test
```

To run only one of all test suites (users, boards or tasks)

```
npm test <suite name>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization (users, boards or tasks)

```
npm run test:auth <suite name>
```
