import { IsEmail } from 'class-validator';
import { NonFunctionProperties } from '../../../common';
import { User } from '../../../logic';

export default class UserResponse {

  @IsEmail()
  public email: string;

  public constructor(input: NonFunctionProperties<UserResponse>) {
    this.email = input.email;
  }

  public static fromUser(user: User): UserResponse {
    return new UserResponse(user);
  }
}
