/**
 * Persistence layer for the application - implements access to the database and to Firebase storage.
 */

export { default as UserEntity } from './db/entity/user.entity';
export { default as UserRepository } from './db/repository/user.repository';

export { default as AuthAdapter } from './firebase/adapter/auth.adapter';
export { default as FirestoreAdapter } from './firebase/adapter/firestore.adapter';

export { default as ImportUserAction } from './firebase/dto/action/import-user.action';
export { default as InitializeAddressbookAction } from './firebase/dto/action/initialize-addressbook.action';
export { default as CreateContactAction } from './firebase/dto/action/create-contact.action';

export { default as ContactCreationResult } from './firebase/dto/result/contact-creation.result';
