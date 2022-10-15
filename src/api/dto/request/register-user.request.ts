import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { NonFunctionProperties } from '../../../common';
import { UserRegistration } from '../../../logic';

export default class RegisterUserRequest {

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  public constructor(input: NonFunctionProperties<RegisterUserRequest>) {
    this.email = input?.email;
    this.password = input?.password;
  }

  public toRegistration(): UserRegistration {
    return new UserRegistration(this);
  }
}
