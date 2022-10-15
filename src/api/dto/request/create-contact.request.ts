import { NonFunctionProperties } from '../../../common';
import { ContactCreation } from '../../../logic';

export default class CreateContactRequest {

  public firstName: string;

  public lastName: string;

  public phoneNumber: string;

  public address: string;

  public constructor(input: NonFunctionProperties<CreateContactRequest>) {
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }

  public toContactCreation(): ContactCreation {
    return new ContactCreation(this);
  }
}
