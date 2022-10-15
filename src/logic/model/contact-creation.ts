import { NonFunctionProperties } from '../../common';

export default class ContactCreation {
  public firstName: string;

  public lastName: string;

  public phoneNumber: string;

  public address: string;

  public constructor(input: NonFunctionProperties<ContactCreation>) {
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }
}
