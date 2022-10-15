import { IdOf, NotImplementedError } from '../../common';
import Contact from '../model/contact';
import ContactCreation from '../model/contact-creation';
import User from '../model/user';

export default class ContactService {

  public async createForUser(contact: ContactCreation, userId: IdOf<User>): Promise<Contact> {
    //@todo implement
    throw new NotImplementedError();
  }
}
