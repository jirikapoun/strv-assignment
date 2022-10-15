import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import app from './app';
import { logger } from './common';
import { UserEntity } from './data';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

const PORT = process.env.PORT || 3000;

useContainer(Container);
createConnection({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [
    UserEntity
  ]
}).then(
  connection => {
    logger.info('Database connection established');

    app.listen(PORT, () => {
      logger.notice(`Express server started at http://localhost:${PORT}`);
    })

    process.on('SIGINT', () => {
      logger.notice('Received SIGINT, gracefully shutting down');
      connection.close()
        .then(() => {
          logger.info('Gracefully closed database connection');
          process.exit(0);
        })
        .catch(err => {
          logger.error('Could not close database connection');
          logger.error(err);
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
