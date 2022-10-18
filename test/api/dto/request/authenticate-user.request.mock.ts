import AuthenticateUserRequest from '../../../../src/api/dto/request/authenticate-user.request';
import { registerUserRequestValid } from './register-user.request.mock';

export const authenticateUserRequestValid: Partial<AuthenticateUserRequest> = registerUserRequestValid;

export const authenticateUserRequestInvalidEmail: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  email: 'invalid',
}

export const authenticateUserRequestIncorrectEmail: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  email: 'incorrect@example.org',
}

export const authenticateUserRequestEmptyEmail: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  email: '',
};

export const authenticateUserRequestMissingEmail: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  email: undefined,
};

export const authenticateUserRequestPasswordTooShort: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  password: 'dummy',
};

export const authenticateUserRequestIncorrectPassword: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  password: 'incorrect',
};

export const authenticateUserRequestEmptyPassword: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  password: '',
};

export const authenticateUserRequestMissingPassword: Partial<AuthenticateUserRequest> = {
  ...authenticateUserRequestValid,
  password: undefined
};
