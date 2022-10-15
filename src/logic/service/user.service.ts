import { compare } from 'bcrypt';
import { InternalServerError } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { _throw, DuplicateEmailError, generateToken, hashPassword, logger } from '../../common';
import { UserRepository } from '../../data';
import Token from '../model/token';
import User from '../model/user';
import UserRegistration from '../model/user-registration';

@Service()
export default class UserService {

  public constructor(@InjectRepository() private readonly userRepository: UserRepository) {}

  public async findById(id: string): Promise<User | undefined> {
    const userEntity = await this.userRepository.findOne(id);
    return userEntity ? User.fromEntity(userEntity) : undefined;
  }

  public async register(registration: UserRegistration): Promise<User> {
    const existingEntity = await this.userRepository.findByEmail(registration.email);
    if (existingEntity) {
      throw new DuplicateEmailError(registration.email);
    }

    const entity = registration.toEntity(hashPassword);
    const savedEntity = await this.userRepository.save(entity);
    const user = User.fromEntity(savedEntity);

    logger.info(`Registered user with email ${user.email}`, user);
    return user;
  }

  public async authenticate(email: string, password: string): Promise<Token | false> {
    const userEntity = await this.userRepository.findByEmail(email);
    if (!userEntity) {
      logger.debug(`Authentication failed, user with email ${email} not found`);
      return false;
    }

    const isPasswordValid = await compare(password, userEntity.passwordHash);
    if (!isPasswordValid) {
      logger.debug(`Authentication failed for email ${email}, password is invalid`);
      return false;
    }

    const subject = userEntity.id
      ?? _throw(new InternalServerError('Cannot create token for user with undefined id'));
    const token = generateToken(subject);

    return {
      subject,
      token
    }
  }
}
