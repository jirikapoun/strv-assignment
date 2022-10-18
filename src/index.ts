import { applicationDefault, initializeApp } from 'firebase-admin/app';
import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import app from './app';
import { environment, loadAndValidateEnvironment, logger } from './common';
import { UserEntity } from './data';

loadAndValidateEnvironment();
initializeApp({
  credential: applicationDefault()
});
useContainer(Container);
createConnection({
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
}).then(
  connection => {
    logger.info('Database connection established');

    app.listen(environment.PORT, () => {
      logger.notice(`Express server started at http://localhost:${environment.PORT}`);
    })

    process.on('SIGINT', () => {
      logger.notice('Received SIGINT, gracefully shutting down');
      connection.close()
        .then(() => {
          logger.info('Gracefully closed database connection');
          process.exit(0);
        })
        .catch(error => {
          logger.error('Could not close database connection', error);
        })
        .finally(() => {
          process.exit(1);
        });
    });
  },
  error => {
    logger.crit('Could not connect to the database!', error);
    process.exit(1);
  }
).catch(err => {
  logger.crit('Application initialization failed!', err);
  process.exit(1);
});
