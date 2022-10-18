import { getAuth } from 'firebase-admin/auth';
import request from 'supertest';
import { getRepository } from 'typeorm';
import { ContactController } from '../../../src/api';
import {
  authenticateUserPath,
  registerUserPath,
  userControllerPath,
} from '../../../src/api/controller/user.controller';
import UserAuthenticatedResponse from '../../../src/api/dto/response/user-authenticated.response';
import { app } from '../../../src/app';
import { UserEntity } from '../../../src/data';
import { expectBadRequest, expectUnauthorized, setup } from '../../test.util';
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

const registerUserEndpoint = userControllerPath + registerUserPath;

const authenticateUserEndpoint = userControllerPath + authenticateUserPath;

export const deleteAllUsers = async () => {
  await getRepository(UserEntity).delete({});

  const firebaseUsers = await getAuth().listUsers();
  await getAuth().deleteUsers(firebaseUsers.users.map(user => user.uid));
};

async function expectNoUser(): Promise<void> {
  const databaseUsers = await getRepository(UserEntity).find();
  expect(databaseUsers).toHaveLength(0);

  const firebaseUsers = await getAuth().listUsers();
  expect(firebaseUsers.users).toHaveLength(0);
}

export const registerValidUser = async () => new Promise<UserAuthenticatedResponse>(resolve => {
  request(app)
    .post(registerUserEndpoint)
    .send(registerUserRequestValid)
    .expect(201)
    .end((err, res) => {
      expect(res.body).toHaveProperty('subject');
      expect(res.body).toHaveProperty('token');
      resolve(res.body);
    });
});

const authorizeValidUser = async () => {
  await request(app)
    .post(authenticateUserEndpoint)
    .send(registerUserRequestValid)
    .expect(200);
}

describe(ContactController.name, () => {

  beforeAll(setup);

  beforeEach(deleteAllUsers);



  // User registration
  describe(registerUserEndpoint, () => {

    it('should register valid user', async () => {
      await expectNoUser();
      await registerValidUser();

      const databaseUsers = await getRepository(UserEntity).find();
      expect(databaseUsers).toHaveLength(1);
      expect(databaseUsers[0].email).toEqual(registerUserRequestValid.email);

      const firebaseUsers = await getAuth().listUsers();
      expect(firebaseUsers.users).toHaveLength(1);
      expect(firebaseUsers.users[0].email).toEqual(registerUserRequestValid.email);

      expect(databaseUsers[0].id).toEqual(firebaseUsers.users[0].uid);
    });

    it('should not register user with invalid email', async () => {
      await expectNoUser();
      await expectBadRequest(registerUserEndpoint, registerUserRequestInvalidEmail);
      await expectNoUser();
    });

    it('should not register user with empty email', async () => {
      await expectNoUser();
      await expectBadRequest(registerUserEndpoint, registerUserRequestEmptyEmail);
      await expectNoUser();
    });

    it('should not register user with missing email', async () => {
      await expectNoUser();
      await expectBadRequest(registerUserEndpoint, registerUserRequestMissingEmail);
      await expectNoUser();
    });

    it('should not register user with invalid password', async () => {
      await expectNoUser();
      await expectBadRequest(registerUserEndpoint, registerUserRequestPasswordTooShort);
      await expectNoUser();
    });

    it('should not register user with empty password', async () => {
      await expectNoUser();
      await expectBadRequest(registerUserEndpoint, registerUserRequestEmptyPassword);
      await expectNoUser();
    });

    it('should not register user with missing password', async () => {
      await expectNoUser();
      await expectBadRequest(registerUserEndpoint, registerUserRequestMissingPassword);
      await expectNoUser();
    });
  });



  // User authentication
  describe(authenticateUserEndpoint, () => {

    beforeEach(registerValidUser);

    it('should authenticate just registered user', async () => {
      await authorizeValidUser();
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
