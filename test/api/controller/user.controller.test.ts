import { getAuth } from 'firebase-admin/auth';
import request from 'supertest';
import { getRepository } from 'typeorm';
import {
  authenticateUserPath,
  registerUserPath,
  userControllerPath,
} from '../../../src/api/controller/user.controller';
import { app } from '../../../src/app';
import { UserEntity } from '../../../src/data';
import setup from '../../setup';
import {
  authenticateUserRequestEmptyEmail,
  authenticateUserRequestEmptyPassword,
  authenticateUserRequestIncorrectEmail,
  authenticateUserRequestIncorrectPassword,
  authenticateUserRequestInvalidEmail,
  authenticateUserRequestMissingEmail,
  authenticateUserRequestMissingPassword,
  authenticateUserRequestPasswordTooShort,
} from '../dto/request/authenticate-user.request.mock';
import {
  registerUserRequestEmptyEmail,
  registerUserRequestEmptyPassword,
  registerUserRequestInvalidEmail,
  registerUserRequestMissingEmail,
  registerUserRequestMissingPassword,
  registerUserRequestPasswordTooShort,
  registerUserRequestValid,
} from '../dto/request/register-user.request.mock';

async function expectBadRequest(url: string, payload: object) {
  await request(app)
    .post(url)
    .send(payload)
    .expect(400);
}

async function expectUnauthorized(url: string, payload: object) {
  await request(app)
    .post(url)
    .send(payload)
    .expect(401);
}

async function verifyDatabase(userCountAfter: number, test: () => Promise<unknown>): Promise<void> {
  const usersBefore = await getRepository(UserEntity).find();
  expect(usersBefore).toHaveLength(0);

  await test();

  const usersAfter = await getRepository(UserEntity).find();
  expect(usersAfter).toHaveLength(userCountAfter);
}

describe('api/user.controller', () => {

  beforeAll(setup);

  beforeEach(async () => {
    await getRepository(UserEntity).delete({});

    const firebaseUsers = await getAuth().listUsers();
    await getAuth().deleteUsers(firebaseUsers.users.map(user => user.uid));
  });



  // User registration
  const registerUserEndpoint = `${userControllerPath}${registerUserPath}`;
  const registerValidUser = async () => {
    await request(app)
      .post(registerUserEndpoint)
      .send(registerUserRequestValid)
      .expect(201);
  };
  describe(registerUserEndpoint, () => {

    it('should register valid user', async () => {
      await verifyDatabase(1, registerValidUser);
    });

    it('should not register user with invalid email', async () => {
      await verifyDatabase(0, async () =>
        await expectBadRequest(registerUserEndpoint, registerUserRequestInvalidEmail));
    });

    it('should not register user with empty email', async () => {
      await verifyDatabase(0, async () =>
        await expectBadRequest(registerUserEndpoint, registerUserRequestEmptyEmail));
    });

    it('should not register user with missing email', async () => {
      await verifyDatabase(0, async () =>
        await expectBadRequest(registerUserEndpoint, registerUserRequestMissingEmail));
    });

    it('should not register user with invalid password', async () => {
      await verifyDatabase(0, async () =>
        await expectBadRequest(registerUserEndpoint, registerUserRequestPasswordTooShort));
    });

    it('should not register user with empty password', async () => {
      await verifyDatabase(0, async () =>
        await expectBadRequest(registerUserEndpoint, registerUserRequestEmptyPassword));
    });

    it('should not register user with missing password', async () => {
      await verifyDatabase(0, async () =>
        await expectBadRequest(registerUserEndpoint, registerUserRequestMissingPassword));
    });
  });



  // User authentication
  const authenticateUserEndpoint = `${userControllerPath}${authenticateUserPath}`;
  describe(authenticateUserEndpoint, () => {

    beforeEach(registerValidUser);

    it('should authenticate just registered user', async () => {
      await request(app)
        .post(authenticateUserEndpoint)
        .send(registerUserRequestValid)
        .expect(200);
    });

    it('should not authenticate user with invalid email', async () => {
      await expectBadRequest(authenticateUserEndpoint, authenticateUserRequestInvalidEmail);
    });

    it('should not authenticate user with incorrect email', async () => {
      await expectUnauthorized(authenticateUserEndpoint, authenticateUserRequestIncorrectEmail);
    });

    it('should not authenticate user with empty email', async () => {
      await expectBadRequest(authenticateUserEndpoint, authenticateUserRequestEmptyEmail);
    });

    it('should not authenticate user with missing email', async () => {
      await expectBadRequest(authenticateUserEndpoint, authenticateUserRequestMissingEmail);
    });

    it('should not authenticate user with invalid password', async () => {
      // 401 is returned instead of 400 because we do not want to make it easier for attackers
      await expectUnauthorized(authenticateUserEndpoint, authenticateUserRequestPasswordTooShort);
    });

    it('should not authenticate user with incorrect password', async () => {
      await expectUnauthorized(authenticateUserEndpoint, authenticateUserRequestIncorrectPassword);
    });

    it('should not authenticate user with empty password', async () => {
      await expectBadRequest(authenticateUserEndpoint, authenticateUserRequestEmptyPassword);
    });

    it('should not authenticate user with missing password', async () => {
      await expectBadRequest(authenticateUserEndpoint, authenticateUserRequestMissingPassword);
    });
  });
});
