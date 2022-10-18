import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NonFunctionProperties } from '../../../common';

@Entity({ name: 'user' })
export default class UserEntity {

  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id?: string;

  @Column({ name: 'email' })
  public email: string;

  @Column({ name: 'passwordHash' })
  public passwordHash: string;

  public constructor(input: NonFunctionProperties<UserEntity>) {
    this.id = input?.id;
    this.email = input?.email;
    this.passwordHash = input?.passwordHash;
  }
}
