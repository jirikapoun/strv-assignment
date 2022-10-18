import RegisterUserRequest from '../../../../src/api/dto/request/register-user.request';

export const registerUserRequestValid: Partial<RegisterUserRequest> = {
  email: 'dummy@example.org',
  password: 'dummy123',
};

export const registerUserRequestInvalidEmail: Partial<RegisterUserRequest> = {
  ...registerUserRequestValid,
  email: 'invalid',
};

export const registerUserRequestEmptyEmail: Partial<RegisterUserRequest> = {
  ...registerUserRequestValid,
  email: '',
};

export const registerUserRequestMissingEmail: Partial<RegisterUserRequest> = {
  ...registerUserRequestValid,
  email: undefined,
};

export const registerUserRequestPasswordTooShort: Partial<RegisterUserRequest> = {
  ...registerUserRequestValid,
  password: 'dummy',
};

export const registerUserRequestEmptyPassword: Partial<RegisterUserRequest> = {
  ...registerUserRequestValid,
  password: '',
};

export const registerUserRequestMissingPassword: Partial<RegisterUserRequest> = {
  ...registerUserRequestValid,
  password: undefined
};
