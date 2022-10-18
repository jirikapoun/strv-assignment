import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import { environment, loadAndValidateEnvironment } from '../src/common';
import { UserEntity } from '../src/data';

export default async function () {
  loadAndValidateEnvironment();
  initializeApp({
    credential: applicationDefault()
  });

  useContainer(Container);
  await createConnection({
    type: environment.DB_TYPE,
    host: environment.DB_HOST,
    username: environment.DB_USERNAME,
    password: environment.DB_PASSWORD,
    database: environment.DB_NAME,
    schema: environment.DB_SCHEMA,
    synchronize: environment.DB_SYNCHRONIZE === 'true',
    dropSchema: environment.DB_DROP_SCHEMA === 'true',
    entities: [
      UserEntity
    ]
  });
  console.log('Database connection established');
}
