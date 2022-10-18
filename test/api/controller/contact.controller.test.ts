import { getFirestore } from 'firebase-admin/firestore';
import request from 'supertest';
import { ContactController } from '../../../src/api';
import {
  contactControllerPath,
  createContactPath,
} from '../../../src/api/controller/contact.controller';
import CreateContactRequest from '../../../src/api/dto/request/create-contact.request';
import UserAuthenticatedResponse from '../../../src/api/dto/response/user-authenticated.response';
import { app } from '../../../src/app';
import { addressbookCollection } from '../../../src/data/firebase/adapter/firestore.adapter';
import { expectBadRequest, expectUnauthorized, setup } from '../../test.util';
import {
  createContactRequestInvalidPhoneNumber,
  createContactRequestValid,
  createContactRequestWithEmpty,
  createContactRequestWithMissing,
} from '../dto/request/create-contact.request.mock';
import { deleteAllUsers, registerValidUser } from './user.controller.test';
import NonFunctionPropertyNames = jest.NonFunctionPropertyNames;

const createContactEndpoint = contactControllerPath + createContactPath;

let authResponse: UserAuthenticatedResponse;

async function expectNoContact(): Promise<void> {
  const contactsBefore = await getFirestore()
    .collection(addressbookCollection)
    .doc(authResponse.subject)
    .collection('contacts')
    .get();
  expect(contactsBefore.size)
    .toBe(0);
}

const createValidContact = async () => new Promise<string>(resolve => {
  request(app)
    .post(createContactEndpoint)
    .auth(authResponse.token, { type: 'bearer' })
    .send(createContactRequestValid)
    .expect(201)
    .end((err, res) => {
      expect(res.body)
        .toHaveProperty('id');
      resolve(res.body.id);
    });
});

describe(ContactController.name, () => {

  beforeAll(setup);

  beforeEach(async () => {
    await deleteAllUsers();
    authResponse = await registerValidUser();
  });

  it('should not create contact for unauthorized user', async () => {
    await expectUnauthorized(createContactEndpoint, createContactRequestValid);
  });

  it('should create valid contact for authorized user', async () => {
    await expectNoContact();
    const contactId = await createValidContact();

    const contacts = await getFirestore()
      .collection(addressbookCollection)
      .doc(authResponse.subject)
      .collection('contacts')
      .get();
    expect(contacts.size).toBe(1);
    expect(contacts.docs[0].id).toBe(contactId);
  })

  it('should create duplicate contact', async () => {
    await expectNoContact();
    const firstContactId = await createValidContact();
    const secondContactId = await createValidContact();

    const contacts = await getFirestore()
      .collection(addressbookCollection)
      .doc(authResponse.subject)
      .collection('contacts')
      .get();
    expect(contacts.size).toBe(2);
    expect(contacts.docs).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: firstContactId }),
      expect.objectContaining({ id: secondContactId }),
    ]));
  })

  it('should not create contact with invalid phone number', async () => {
    await expectNoContact();
    await expectBadRequest(createContactEndpoint, createContactRequestInvalidPhoneNumber, authResponse.token);
    await expectNoContact();
  });

  const properties = Object.keys(createContactRequestValid) as NonFunctionPropertyNames<CreateContactRequest>[];

  it.each(properties)('should not create contact with empty %s', async (property) => {
    await expectNoContact();
    await expectBadRequest(createContactEndpoint, createContactRequestWithEmpty(property), authResponse.token);
    await expectNoContact();
  });

  it.each(properties)('should not create contact with missing %s', async (property) => {
    await expectNoContact();
    await expectBadRequest(createContactEndpoint, createContactRequestWithMissing(property), authResponse.token);
    await expectNoContact();
  });
});
