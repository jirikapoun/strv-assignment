import dotenv from 'dotenv';
import 'reflect-metadata';
import { Connection, createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import app from './app';
import { logger } from './common';
import { UserEntity } from './data';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

// Container.set(Logger, logger);

const PORT = process.env.PORT || 3000;

useContainer(Container);
createConnection({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [
    UserEntity
  ]
}).then((connection: Connection) => {
  logger.info('Database connection established');

  app.listen(PORT, () => {
    logger.notice(`Express server started at http://localhost:${PORT}`);
  })

  process.on('SIGINT', () => {
    logger.notice('Received SIGINT, gracefully shutting down');
    connection.close()
      .then(() => {
        logger.info('Gracefully closed database connection');
      })
      .catch(err => {
        logger.error('Could not close database connection');
        logger.error(err);
      })
      .finally(() => {
        process.exit(0);
      });
  });
}).catch(error => {
  logger.crit('Could not connect to the database!');
  logger.crit(error);
});
