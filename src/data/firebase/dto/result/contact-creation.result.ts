import { NonFunctionProperties } from '../../../../common';

export default class ContactCreationResult {

  public id: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber: string;
  public address: string;

  public constructor(input: NonFunctionProperties<ContactCreationResult>) {
    this.id = input?.id;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }
}
