import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import UserEntity from '../entity/user.entity';

@EntityRepository(UserEntity)
@Service()
export default class UserRepository extends Repository<UserEntity> {

  public async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.findOne({ email });
  }
}
