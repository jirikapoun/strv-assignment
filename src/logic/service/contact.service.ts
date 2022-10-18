import { Service } from 'typedi';
import { IdOf } from '../../common';
import { FirestoreAdapter } from '../../data';
import Contact from '../model/contact';
import ContactCreation from '../model/contact-creation';
import User from '../model/user';

/**
 * Service for managing contacts of users.
 */
@Service()
export default class ContactService {

  public constructor(private readonly firestoreAdapter: FirestoreAdapter) {}

  /**
   * Adds a new contact to the user's address book.
   * @returns The newly created contact.
   */
  public async createForUser(creation: ContactCreation, userId: IdOf<User>): Promise<Contact> {
    const result = await this.firestoreAdapter.createContact(creation.toCreateContactAction(), userId);
    return Contact.fromContactCreationResult(result);
  }
}
