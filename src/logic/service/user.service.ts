import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  _throw,
  DuplicateEmailError,
  generateToken,
  hashPassword,
  logger,
  UndefinedValueError,
  verifyPassword,
} from '../../common';
import { AuthAdapter, FirestoreAdapter, UserRepository } from '../../data';
import Token from '../model/token';
import User from '../model/user';
import UserRegistration from '../model/user-registration';

/**
 * Service for user account related operations.
 */
@Service()
export default class UserService {

  public constructor(
    @InjectRepository() private readonly userRepository: UserRepository,
    private readonly userAdapter: AuthAdapter,
    private readonly firestoreAdapter: FirestoreAdapter,
  ) {}

  /**
   * Returns the user with the given id.
   * @returns User with the given id if it exists, `undefined` otherwise.
   */
  public async findById(id: string): Promise<User | undefined> {
    const userEntity = await this.userRepository.findOne(id);
    return userEntity ? User.fromEntity(userEntity) : undefined;
  }

  /**
   * Creates a new user in the system with the given registration data.
   * @returns The newly created user.
   */
  public async register(registration: UserRegistration): Promise<User> {
    const existingEntity = await this.userRepository.findByEmail(registration.email);
    if (existingEntity) {
      throw new DuplicateEmailError(registration.email);
    }

    const entity = registration.toEntity(hashPassword);
    const savedEntity = await this.userRepository.save(entity);
    const user = User.fromEntity(savedEntity);

    try {
      await this.userAdapter.importUser(user.toImportUserAction());
    } catch (error) {
      logger.error(`Error occured during Firebase user import for email ${registration.email}, reverting registration`);
      await this.userRepository.delete(user.id);
      throw error;
    }

    try {
      await this.firestoreAdapter.initializeAddressbook(user.toInitializeAddressbookAction());
    } catch (error) {
      logger.warning(`Error occured during Firebase addressbook initialization for user ${user.id}`);
      throw error;
    }

    logger.info(`Registered user with email ${user.email}`, { ...user, passwordHash: undefined });
    return user;
  }

  /**
   * Verifies the user's credentials, generates a JWT token for the user and returns the token.
   * @returns Authentication token for the user if the credentials are valid, `false` otherwise.
   */
  public async authenticate(email: string, password: string): Promise<Token | false> {
    const userEntity = await this.userRepository.findByEmail(email);
    if (!userEntity) {
      logger.debug(`Authentication failed, user with email ${email} not found`);
      return false;
    }

    const isPasswordValid = await verifyPassword(password, userEntity.passwordHash);
    if (!isPasswordValid) {
      logger.debug(`Authentication failed for email ${email}, password is invalid`);
      return false;
    }

    const subject = userEntity.id
      ?? _throw(new UndefinedValueError('Cannot create token for user with undefined id', userEntity));
    const token = generateToken(subject);

    return {
      subject,
      token
    }
  }
}
