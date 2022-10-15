import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { NonFunctionProperties } from '../../../common';

export default class AuthenticateUserRequest {

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  public constructor(input: NonFunctionProperties<AuthenticateUserRequest>) {
    this.email = input?.email;
    this.password = input?.password;
  }
}
