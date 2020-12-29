const request = require('supertest');
const { users } = require('../../resources/users/user.model');
const app = require('../../app');
const connectToDB = require('../../common/DB/db');
const errorMessages = require('../../common/errors/errorMessages.json');

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

const activeUser = {
  login: 'user1',
  name: 'Foo Bar',
  email: 'user1@mail.com',
  password: 'P4ssword!',
  activationToken: 'token',
  inactive: false
};

const credentials = { login: 'user1', password: 'P4ssword!' };

const addUser = async (user = { ...activeUser }) => {
  return await users.create(user);
};

const postAuthentication = async userCredentials => {
  const agent = request(app).post('/login');

  return await agent.send(userCredentials);
};

describe('Authentication', () => {
  it('returns 200 when credentials are correct', async () => {
    await addUser();
    const response = await postAuthentication(credentials);

    jestExpect(response.status).toBe(200);
  });

  it('returns 403 when user does not exist', async () => {
    const response = await postAuthentication(credentials);

    jestExpect(response.status).toBe(403);
  });

  it(`returns ${errorMessages.authentication_failure} when authentication fails`, async () => {
    const response = await postAuthentication(credentials);

    jestExpect(response.body.message).toBe(
      errorMessages.authentication_failure
    );
  });

  it('returns 403 when password is wrong', async () => {
    await addUser();
    const response = await postAuthentication({
      login: 'user1',
      password: 'password'
    });

    jestExpect(response.status).toBe(403);
  });

  it('returns 403 when logging in with an inactive account', async () => {
    await addUser({ ...activeUser, inactive: true });
    const response = await postAuthentication(credentials);

    jestExpect(response.status).toBe(403);
  });

  it(`returns ${errorMessages.email_not_verified} when authentication fails for inactive account`, async () => {
    await addUser({ ...activeUser, inactive: true });
    const response = await postAuthentication(credentials);

    jestExpect(response.body.message).toBe(errorMessages.email_not_verified);
  });

  it('returns 403 when login is not valid', async () => {
    const response = await postAuthentication({ password: 'P4ssword!' });

    jestExpect(response.status).toBe(403);
  });

  it('returns 403 when password is not valid', async () => {
    const response = await postAuthentication({ login: 'user1' });

    jestExpect(response.status).toBe(403);
  });

  it('returns token in response body when credentials are correct', async () => {
    await addUser();
    const response = await postAuthentication(credentials);

    jestExpect(response.body.token).not.toBeUndefined();
  });
});
