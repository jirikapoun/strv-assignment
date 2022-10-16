import { Service } from 'typedi';
import { IdOf } from '../../common';
import { FirestoreAdapter } from '../../data';
import Contact from '../model/contact';
import ContactCreation from '../model/contact-creation';
import User from '../model/user';

@Service()
export default class ContactService {

  public constructor(private readonly firestoreAdapter: FirestoreAdapter) {}

  public async createForUser(creation: ContactCreation, userId: IdOf<User>): Promise<Contact> {
    const result = await this.firestoreAdapter.createContact(creation.toCreateContactAction(), userId);
    return Contact.fromContactCreationResult(result);
  }
}
