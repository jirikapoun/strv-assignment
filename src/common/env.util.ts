import { Expose, plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateBy,
  validateSync,
} from 'class-validator';
import dotenv from 'dotenv';
import ms from 'ms';
import { DatabaseType } from 'typeorm';
import { logger, LogLevel } from './log.util';
import { NonFunctionProperties } from './type.util';

const databaseTypes: DatabaseType[] = [
  'aurora-data-api',
  'aurora-data-api-pg',
  'better-sqlite3',
  'capacitor',
  'cockroachdb',
  'cordova',
  'expo',
  'mariadb',
  'mongodb',
  'mssql',
  'mysql',
  'nativescript',
  'oracle',
  'postgres',
  'react-native',
  'sap',
  'sqlite',
  'sqljs',
];

function expirationValid(expiration: string): boolean {
  try {
    ms(expiration);
    return true;
  } catch (e) {
    return false;
  }
}

const logLevels: LogLevel[] = [
  'emerg',
  'alert',
  'crit',
  'error',
  'warning',
  'notice',
  'info',
  'debug',
]

export type NodeEnv = 'development' | 'production';

const nodeEnvs: NodeEnv[] = ['development', 'production'];

export class Environment {

  /** Type of database to use. */
  @IsIn(databaseTypes)
  @Expose()
  DB_TYPE: DatabaseType;

  /** Database hostname (if applies for the used database type). */
  @IsString()
  @IsOptional()
  @Expose()
  DB_HOST: string;

  /** Database name (if applies for the used database type). */
  @IsString()
  @IsOptional()
  @Expose()
  DB_NAME: string;

  /** Schema name (if applies for the used database type). */
  @IsString()
  @IsOptional()
  @Expose()
  DB_SCHEMA: string;

  /** Set to true to synchronize database schema with the entities on startup.
   *  Not to be used in production. Use database migrations instead. */
  @IsBoolean()
  @Expose()
  DB_SYNC: boolean;

  /** Set to true to drop the database schema on every startup.
   *  Definitely not to be used in production. */
  @IsBoolean()
  @Expose()
  DB_DROP: boolean;

  @IsString()
  @Length(64,64)
  @Expose()
  JWT_SECRET: string;

  @ValidateBy({ name: 'expirationValid', validator: { validate: expirationValid } })
  @Expose()
  JWT_EXPIRATION: string;

  @IsIn(logLevels)
  @Expose()
  LOG_LEVEL: LogLevel;

  @IsIn(nodeEnvs)
  @Expose()
  NODE_ENV: NodeEnv;

  /** Port number for the server to listen on. */
  @IsNumber()
  @Expose()
  PORT: number;

  public constructor(input: NonFunctionProperties<Environment>) {
    this.DB_TYPE = input?.DB_TYPE;
    this.DB_HOST = input?.DB_HOST;
    this.DB_NAME = input?.DB_NAME;
    this.DB_SCHEMA = input?.DB_SCHEMA;
    this.DB_SYNC = input?.DB_SYNC;
    this.DB_DROP = input?.DB_DROP;
    this.JWT_SECRET = input?.JWT_SECRET;
    this.JWT_EXPIRATION = input?.JWT_EXPIRATION;
    this.LOG_LEVEL = input?.LOG_LEVEL;
    this.NODE_ENV = input?.NODE_ENV;
    this.PORT = input?.PORT;
  }
}

export let environment: Environment;

export function loadAndValidateEnvironment() {
  const debug = process.env.NODE_ENV === 'development';
  dotenv.config({ debug });

  environment = plainToClass(
    Environment,
    process.env,
    {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }
  );
  const errors = validateSync(environment);
  if (errors.length > 0) {
    logger.crit(
      `Environment validation failed!\n${
        errors.map(error => error.toString().trimEnd()).join('\n')
      }`
    );
    process.exit(1);
  } else {
    logger.info('Environment validation sucessful');
  }
}
