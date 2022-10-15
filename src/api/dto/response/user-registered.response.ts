import { IsEmail } from 'class-validator';
import { NonFunctionProperties } from '../../../common';
import { User } from '../../../logic';

export default class UserRegisteredResponse {

  @IsEmail()
  public email: string;

  private constructor(input: NonFunctionProperties<UserRegisteredResponse>) {
    this.email = input.email;
  }

  public static fromUser(user: User): UserRegisteredResponse {
    return new UserRegisteredResponse(user);
  }
}
