import { NonFunctionProperties } from '../../../common/type.util';
import Contact from '../../../logic/model/contact';

export default class ContactResponse {

  public id: string;

  public firstName: string;

  public lastName: string;

  public phoneNumber: string;

  public address: string;

  public constructor(input: NonFunctionProperties<ContactResponse>) {
    this.id = input?.id;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }

  public static fromContact(contact: Contact): ContactResponse {
    return new ContactResponse(contact);
  }
}
