import { instanceToPlain } from 'class-transformer';
import { NonFunctionProperties } from '../../../../common';

export default class InitializeAddressbookAction {

  public uid: string;
  public email: string;

  public constructor(input: NonFunctionProperties<InitializeAddressbookAction>) {
    this.uid = input?.uid;
    this.email = input?.email;
  }

  public serialize(): object {
    return instanceToPlain(this);
  }
}
