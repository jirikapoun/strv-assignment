import { getFirestore } from 'firebase-admin/firestore';
import { Service } from 'typedi';
import CreateContactAction from '../dto/action/create-contact.action';
import InitializeAddressbookAction from '../dto/action/initialize-addressbook.action';
import ContactCreationResult from '../dto/result/contact-creation.result';

export const addressbookCollection = 'addressbooks';

@Service()
export default class FirestoreAdapter {

  private readonly firestore = getFirestore();

  public async initializeAddressbook(action: InitializeAddressbookAction): Promise<void> {
    const addressbookRef = this.firestore.collection(addressbookCollection).doc(action.uid);
    await addressbookRef.set(action.serialize());
  }

  public async createContact(action: CreateContactAction, uid: string): Promise<ContactCreationResult> {
     const addressbookRef = this.firestore.collection(addressbookCollection).doc(uid);

     const contactRef = addressbookRef.collection('contacts').doc();
     await contactRef.set(action.serialize());

     return new ContactCreationResult({
       id: contactRef.id,
        ...action,
     })
  }
}
