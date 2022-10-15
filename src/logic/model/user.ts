import { InternalServerError } from 'routing-controllers';
import { _throw, NonFunctionProperties } from '../../common';
import { UserEntity } from '../../data';

export default class User {

  public id: string;

  public email: string;

  constructor(input: NonFunctionProperties<User>) {
    this.id = input?.id;
    this.email = input?.email;
  }

  public static fromEntity(entity: UserEntity): User {
    return new User({
      id: entity.id
        ?? _throw(new InternalServerError('Cannot create User from entity with undefined id')),
      ...entity,
    });
  }
}
