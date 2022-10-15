import { NonFunctionProperties } from '../../common/type.util';

export default class User {

  public id: string;

  public email: string;

  constructor(input: NonFunctionProperties<User>) {
    this.id = input?.id;
    this.email = input?.email;
  }
}
