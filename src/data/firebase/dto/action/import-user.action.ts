import { NonFunctionProperties } from '../../../../common';

export default class ImportUserAction {

  public uid: string;
  public email: string;
  public passwordHash: Buffer;

  public constructor(input: NonFunctionProperties<ImportUserAction>) {
    this.uid = input?.uid;
    this.email = input?.email;
    this.passwordHash = input?.passwordHash;
  }
}
