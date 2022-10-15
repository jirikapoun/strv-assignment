import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DuplicateEmailError } from '../../common';
import { UserRepository } from '../../data';
import User from '../model/user';
import UserRegistration from '../model/user-registration';

@Service()
export default class UserService {

  public constructor(@InjectRepository() private readonly userRepository: UserRepository) {}

  public async register(registration: UserRegistration): Promise<User> {
    const existingEntity = await this.userRepository.findByEmail(registration.email);
    if (existingEntity) {
      throw new DuplicateEmailError(registration.email);
    }

    const newEntity = await this.userRepository.save(registration.toEntity());
    return User.fromEntity(newEntity);
  }


  public async authenticate(email: string, password: string): Promise<User> {
    //@todo: implement
    const user = new User({
      id: 'id',
      email
    });
    return user;
  }
}
