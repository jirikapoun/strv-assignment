import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { NonFunctionProperties } from '../../../common';

export default class AuthenticateUserRequest {

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  public constructor(input: NonFunctionProperties<AuthenticateUserRequest>) {
    this.email = input?.email;
    this.password = input?.password;
  }
}
