import { _throw, NonFunctionProperties, UndefinedValueError } from '../../common';
import { ImportUserAction, InitializeAddressbookAction, UserEntity } from '../../data';

/**
 * A user account in the system.
 */
export default class User {

  public id: string;
  public email: string;
  public passwordHash: string;

  public constructor(input: NonFunctionProperties<User>) {
    this.id = input?.id;
    this.email = input?.email;
    this.passwordHash = input?.passwordHash;
  }

  public toImportUserAction(): ImportUserAction {
    return new ImportUserAction({
      uid: this.id,
      email: this.email,
      passwordHash: Buffer.from(this.passwordHash),
    });
  }

  public toInitializeAddressbookAction(): InitializeAddressbookAction {
    return new InitializeAddressbookAction({
      uid: this.id,
      email: this.email,
    });
  }

  public static fromEntity(entity: UserEntity): User {
    return new User({
      id: entity.id
        ?? _throw(new UndefinedValueError('Cannot create User from entity with undefined id', entity)),
      ...entity,
    });
  }
}
