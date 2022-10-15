import { Service } from 'typedi';
import { Logger } from 'winston';
import User from '../model/user';
import UserRegistration from '../model/user-registration';

@Service()
export default class UserService {

  public constructor(private readonly logger: Logger) {}

  public async register(registration: UserRegistration): Promise<User> {
    //@todo: implement
    const user = new User({
      id: 'id',
      email: registration.email,
    });
    this.logger.info(`User registered`, user);
    return user;
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
