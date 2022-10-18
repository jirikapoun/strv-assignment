import { NonFunctionProperties } from '../../common';
import { ContactCreationResult } from '../../data';

/**
 * A contact from a user's address book.
 */
export default class Contact {

  public id: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber: string;
  public address: string;

  private constructor(input: NonFunctionProperties<Contact>) {
    this.id = input?.id;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }

  public static fromContactCreationResult(result: ContactCreationResult): Contact {
    return new Contact(result);
  }
}
