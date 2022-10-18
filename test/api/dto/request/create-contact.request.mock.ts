import CreateContactRequest from '../../../../src/api/dto/request/create-contact.request';
import NonFunctionPropertyNames = jest.NonFunctionPropertyNames;

export const createContactRequestValid: Partial<CreateContactRequest> = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+420800123456',
  address: '123 Main St',
}

export function createContactRequestWithEmpty(property: NonFunctionPropertyNames<CreateContactRequest>): Partial<CreateContactRequest> {
  const request = { ...createContactRequestValid };
  request[property] = '';
  return request;
}

export function createContactRequestWithMissing(property: NonFunctionPropertyNames<CreateContactRequest>): Partial<CreateContactRequest> {
  const request = { ...createContactRequestValid };
  delete request[property];
  return request;
}

export const createContactRequestInvalidPhoneNumber: Partial<CreateContactRequest> = {
  ...createContactRequestValid,
  phoneNumber: 'invalid',
}
