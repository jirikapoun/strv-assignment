import { IsEmail } from 'class-validator';
import { NonFunctionProperties } from '../../../common/type.util';
import User from '../../../logic/model/user';

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
