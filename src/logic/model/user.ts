import { _throw, NonFunctionProperties, UndefinedValueError } from '../../common';
import { UserEntity } from '../../data';

export default class User {

  public id: string;

  public email: string;

  public passwordHash: string;

  public constructor(input: NonFunctionProperties<User>) {
    this.id = input?.id;
    this.email = input?.email;
    this.passwordHash = input?.passwordHash;
  }

  public static fromEntity(entity: UserEntity): User {
    return new User({
      id: entity.id
        ?? _throw(new UndefinedValueError('Cannot create User from entity with undefined id', entity)),
      ...entity,
    });
  }
}
