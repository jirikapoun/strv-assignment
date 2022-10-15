import { IsJWT, IsUUID } from 'class-validator';
import { NonFunctionProperties } from '../../../common';
import { Token } from '../../../logic';

export default class UserAuthenticatedResponse {

  @IsUUID()
  public subject: string;

  @IsJWT()
  public token: string

  private constructor(input: NonFunctionProperties<UserAuthenticatedResponse>) {
    this.subject = input?.subject;
    this.token = input?.token;
  }

  public static fromToken(token: Token): UserAuthenticatedResponse {
    return new UserAuthenticatedResponse(token);
  }
}
