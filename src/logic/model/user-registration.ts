import { NonFunctionProperties } from '../../common';

export default class UserRegistration {

  public email: string;

  public password: string;

  constructor(input: NonFunctionProperties<UserRegistration>) {
    this.email = input?.email;
    this.password = input?.password;
  }
}
