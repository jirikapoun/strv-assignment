import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NonFunctionProperties } from '../../../common';

@Entity()
export default class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  public constructor(input: NonFunctionProperties<UserEntity>) {
    this.id = input?.id;
    this.email = input?.email;
    this.password = input?.password;
  }
}
