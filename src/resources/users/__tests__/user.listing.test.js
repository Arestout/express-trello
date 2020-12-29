const request = require('supertest');
const { users } = require('../user.model');
const app = require('../../../app');
const connectToDB = require('../../../common/DB/db');

const validUser = {
  name: 'Bob Foo',
  login: 'user3',
  email: 'user3@mail.com',
  password: 'P4ssword!',
  activationToken: 'token'
};

const postUser = (user = validUser) => {
  const agent = request(app).post('/users');

  return agent.send(user);
};

let server;

beforeAll(async () => {
  connectToDB(() => {
    server = app.listen(4002, () =>
      console.log('App is running on http://localhost:4002')
    );
  });
});

beforeEach(async () => {
  await users.deleteMany({});
});

afterAll(async () => {
  try {
    await server.close();
  } catch (error) {
    console.log(`
              You did something wrong dummy!
              ${error}
            `);
    throw error;
  }
});

describe('Get User', () => {
  const fakeId = '5fb6d046e258546724fbf2d7';
  const getUser = (id = fakeId) => {
    return request(app).get(`/users/${id}`);
  };
  it('returns 404 when user not found', async () => {
    const response = await getUser();

    jestExpect(response.status).toBe(404);
  });

  it('returns correct error message for unknown user', async () => {
    const response = await getUser();

    jestExpect(response.body.message).toBe(
      `The user with id ${fakeId} was not found`
    );
  });

  it('returns 200 when an active user exist', async () => {
    const user = await users.create(validUser);
    const response = await getUser(user.id);

    jestExpect(response.status).toBe(200);
  });

  it('returns 404 when the user is inactive', async () => {
    const user = await postUser({
      ...validUser,
      inactive: true
    });
    const response = await getUser(user.id);

    jestExpect(response.status).toBe(404);
  });
});
