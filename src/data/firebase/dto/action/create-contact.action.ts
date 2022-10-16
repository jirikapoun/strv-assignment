import { instanceToPlain } from 'class-transformer';
import { NonFunctionProperties } from '../../../../common';

export default class CreateContactAction {

  public firstName: string;
  public lastName: string;
  public phoneNumber: string;
  public address: string;

  public constructor(input: NonFunctionProperties<CreateContactAction>) {
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.phoneNumber;
    this.address = input?.address;
  }

  public serialize(): object {
    return instanceToPlain(this);
  }
}
