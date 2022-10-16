import { NonFunctionProperties } from '../../common';
import { UserEntity } from '../../data';

export default class UserRegistration {

  public email: string;
  public password: string;

  public constructor(input: NonFunctionProperties<UserRegistration>) {
    this.email = input?.email;
    this.password = input?.password;
  }

  public toEntity(hasher: (password: string) => string): UserEntity {
    return new UserEntity({
      ...this,
      passwordHash: hasher(this.password),
    });
  }
}
