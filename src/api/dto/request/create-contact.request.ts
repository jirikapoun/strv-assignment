import { IsPhoneNumber, IsString } from 'class-validator';
import { NonFunctionProperties } from '../../../common';
import { ContactCreation } from '../../../logic';

export default class CreateContactRequest {

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsPhoneNumber()
  public phoneNumber: string;

  @IsString()
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
