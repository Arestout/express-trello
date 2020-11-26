const request = require('supertest');
const { users } = require('../user.model');
const SMTPServer = require('smtp-server').SMTPServer;
const app = require('../../../app');
const expectedMessages = require('../../../common/errors/errorMessages');
const connectToDB = require('../../../common/DB/db');
const config = require('config');

const validUser = {
  name: 'Bob Foo',
  login: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword!'
};

const postUser = (user = validUser) => {
  const agent = request(app).post('/users');

  return agent.send(user);
};

let server;
let mailServer;
let lastMail;
let simulateSmtpFailure = false;

beforeAll(async () => {
  connectToDB(() => {
    server = app.listen(4002, () =>
      console.log('App is running on http://localhost:4001')
    );
  });

  mailServer = new SMTPServer({
    authOptional: true,
    onData(stream, session, callback) {
      let mailBody;
      stream.on('data', data => {
        mailBody += data.toString();
      });
      stream.on('end', () => {
        if (simulateSmtpFailure) {
          const err = new Error('Invalid mailbox');
          err.responseCode = 553;
          return callback(err);
        }
        lastMail = mailBody;
        callback();
      });
    }
  });

  await mailServer.listen(config.mail.port, 'localhost');
});

beforeEach(async () => {
  simulateSmtpFailure = false;
  await users.deleteMany({});
});

afterAll(async () => {
  try {
    // Connection to Mongo killed.
    //   await mongoose.disconnect();
    // Server connection closed.
    await server.close();
    await mailServer.close();
  } catch (error) {
    console.log(`
        You did something wrong dummy!
        ${error}
      `);
    throw error;
  }
});

describe('User Registration', () => {
  it('returns 200 OK when signup request is valid', async () => {
    try {
      const response = await postUser();

      jestExpect(response.status).toBe(200);
    } catch (error) {
      console.log(error);
    }
  });

  it('saves to database and returns new user when signup request is valid', async () => {
    try {
      const response = await postUser();
      const { id, name, email, login } = response.body;

      jestExpect(id).not.toBeUndefined();
      jestExpect(name).toBe(validUser.name);
      jestExpect(email).toBe(validUser.email);
      jestExpect(login).toBe(validUser.login);
    } catch (error) {
      console.log(error);
    }
  });

  it('should not return new user without password', async () => {
    try {
      const response = await postUser();

      jestExpect(response.body.password).toBeUndefined();
    } catch (error) {
      console.log(error);
    }
  });

  it('hashes the password in database', async () => {
    try {
      await postUser();
      const userList = await users.find();
      const savedUser = userList[0];
      jestExpect(savedUser.password).not.toBe('P4ssword');
    } catch (error) {
      console.log(error);
    }
  });

  it('returns 400 when username is null', async () => {
    const response = await postUser({
      ...validUser,
      login: null
    });
    jestExpect(response.status).toBe(400);
  });

  it('returns validationErrors field in response body when validation error occurs', async () => {
    const response = await postUser({
      ...validUser,
      login: null,
      email: null
    });
    const { body } = response;

    jestExpect(body.validationErrors).not.toBeUndefined();
  });

  it('returns errors for both when username and email is null', async () => {
    const response = await postUser({
      ...validUser,
      login: null,
      email: null
    });
    const { body } = response;

    jestExpect(Object.keys(body.validationErrors)).toEqual(['login', 'email']);
  });

  it.each`
    field         | value              | expectedMessage
    ${'login'}    | ${null}            | ${expectedMessages.login_invalid}
    ${'login'}    | ${'usr'}           | ${expectedMessages.login_invalid}
    ${'login'}    | ${'a'.repeat(33)}  | ${expectedMessages.login_invalid}
    ${'email'}    | ${null}            | ${expectedMessages.email_invalid}
    ${'email'}    | ${'mail.com'}      | ${expectedMessages.email_invalid}
    ${'email'}    | ${'user.mail.com'} | ${expectedMessages.email_invalid}
    ${'email'}    | ${'user @mail'}    | ${expectedMessages.email_invalid}
    ${'password'} | ${null}            | ${expectedMessages.password_pattern}
    ${'password'} | ${'P4ssw'}         | ${expectedMessages.password_size}
    ${'password'} | ${'alllowercase'}  | ${expectedMessages.password_pattern}
    ${'password'} | ${'alllowercase'}  | ${expectedMessages.password_pattern}
    ${'password'} | ${'ALLUPPERCASE'}  | ${expectedMessages.password_pattern}
    ${'password'} | ${'1234567890'}    | ${expectedMessages.password_pattern}
    ${'password'} | ${'lowerandUPPER'} | ${expectedMessages.password_pattern}
    ${'password'} | ${'lower4nd5667'}  | ${expectedMessages.password_pattern}
    ${'password'} | ${'UPPER44444'}    | ${expectedMessages.password_pattern}
  `(
    'returns $expectedMessage when $field is $value',
    async ({ field, expectedMessage, value }) => {
      const user = { ...validUser };
      user[field] = value;
      const response = await postUser(user);
      const body = response.body;

      jestExpect(body.validationErrors[field]).toBe(expectedMessage);
    }
  );

  it(`returns ${expectedMessages.email_in_use} when same email is already in use`, async () => {
    await postUser({ ...validUser });
    const response = await postUser();

    jestExpect(response.body.validationErrors.email).toBe(
      expectedMessages.email_in_use
    );
  });

  it('returns errors for both username is null and email is in use', async () => {
    await postUser({ ...validUser });
    const response = await postUser({
      ...validUser,
      login: null
    });
    const { body } = response;

    jestExpect(Object.keys(body.validationErrors)).toEqual(['login', 'email']);
  });

  it('creates user in inactive mode', async () => {
    await postUser();
    const usersArray = await users.find();
    const savedUser = usersArray[0];

    jestExpect(savedUser.inactive).toBe(true);
  });

  it('creates user in inactive mode even the request body contains inactive as false', async () => {
    const newUser = { ...validUser, inactive: false };
    await postUser(newUser);
    const usersArray = await users.find();
    const savedUser = usersArray[0];

    jestExpect(savedUser.inactive).toBe(true);
  });

  it('creates an activationToken for user', async () => {
    await postUser();
    const usersArray = await users.find();
    const savedUser = usersArray[0];

    jestExpect(savedUser.activationToken).toBeTruthy();
  });

  it('sends an Account activation email with activationToken', async () => {
    await postUser();
    const usersArray = await users.find();
    const savedUser = usersArray[0];

    jestExpect(lastMail).toContain('user1@mail.com');
    jestExpect(lastMail).toContain(savedUser.activationToken);
  });

  it('returns 502 Bad Gateway when sending email fails', async () => {
    simulateSmtpFailure = true;
    const response = await postUser();

    jestExpect(response.status).toBe(502);
  });

  it('returns Email failure message when sending email fails', async () => {
    simulateSmtpFailure = true;
    const response = await postUser();

    jestExpect(response.body.message).toBe(expectedMessages.email_failure);
  });

  it('returns 502 Bad Gateway when sending email fails', async () => {
    simulateSmtpFailure = true;
    const response = await postUser();

    jestExpect(response.status).toBe(502);
  });

  it('returns Email failure message when sending email fails', async () => {
    simulateSmtpFailure = true;
    const response = await postUser();

    jestExpect(response.body.message).toBe(expectedMessages.email_failure);
  });

  it('does not save user to database if activation email fails', async () => {
    simulateSmtpFailure = true;
    await postUser();
    const usersArray = await users.find();

    jestExpect(usersArray.length).toBe(0);
  });
});

describe('Account activation', () => {
  it('activates the account when correct token is sent', async () => {
    await postUser();
    let usersArray = await users.find();
    const token = usersArray[0].activationToken;

    await request(app)
      .post(`/users/token/${token}`)
      .send();
    usersArray = await users.find();

    jestExpect(usersArray[0].inactive).toBe(false);
  });

  it('removes the token from user table after successful activation', async () => {
    await postUser();
    let usersArray = await users.find();
    const token = usersArray[0].activationToken;

    await request(app)
      .post(`/users/token/${token}`)
      .send();
    usersArray = await users.find();

    jestExpect(usersArray[0].activationToken).toBeFalsy();
  });

  it('does not activate the account when token is wrong', async () => {
    await postUser();
    const token = 'this-token-does-not-exist';

    await request(app)
      .post(`/users/token/${token}`)
      .send();

    const usersArray = await users.find();

    jestExpect(usersArray[0].inactive).toBe(true);
  });

  it('returns bad request when token is wrong', async () => {
    await postUser();
    const token = 'this-token-does-not-exist';
    const response = await request(app)
      .post(`/users/token/${token}`)
      .send();

    jestExpect(response.status).toBe(400);
  });

  it.each`
    tokenStatus  | message
    ${'wrong'}   | ${expectedMessages.account_activation_failure}
    ${'correct'} | ${expectedMessages.account_activation_success}
  `(
    'returns $message when token is $tokenStatus',
    async ({ tokenStatus, message }) => {
      await postUser();
      let token = 'this-token-does-not-exist';
      if (tokenStatus === 'correct') {
        const usersArray = await users.find();
        token = usersArray[0].activationToken;
      }

      const response = await request(app)
        .post(`/users/token/${token}`)
        .send();

      jestExpect(response.body.message).toBe(message);
    }
  );
});
