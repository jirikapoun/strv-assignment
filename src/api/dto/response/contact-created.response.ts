import { IsPhoneNumber, IsString } from 'class-validator';
import { NonFunctionProperties } from '../../../common';
import { Contact } from '../../../logic';

export default class ContactCreatedResponse {

  @IsString()
  public id: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsPhoneNumber()
  public phoneNumber: string;

  @IsString()
  public address: string;

  private constructor(input: NonFunctionProperties<ContactCreatedResponse>) {
    this.id = input?.id;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }

  public static fromContact(contact: Contact): ContactCreatedResponse {
    return new ContactCreatedResponse(contact);
  }
}
