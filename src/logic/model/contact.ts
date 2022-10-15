export default class Contact {

  public id: string;

  public firstName: string;

  public lastName: string;

  public phoneNumber: string;

  public address: string;

  public constructor(input: Contact) {
    this.id = input?.id;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }
}
