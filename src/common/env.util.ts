import { Expose, plainToClass } from 'class-transformer';
import {
  IsBooleanString,
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
import { logger, LogLevel } from './log.util';
import { NonFunctionProperties } from './type.util';

const databaseTypes = [
  'postgres',
  'sqlite',
] as const;

type DatabaseType = typeof databaseTypes[number];

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

const nodeEnvs = ['development', 'production', 'test'] as const;

type NodeEnv = typeof nodeEnvs[number];

function expirationValid(expiration: string): boolean {
  try {
    ms(expiration);
    return true;
  } catch (e) {
    return false;
  }
}

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

  /** Database connection username (if applies for the used database type). */
  @IsString()
  @IsOptional()
  @Expose()
  DB_USERNAME: string;

  /** Database connection username (if applies for the used database type). */
  @IsString()
  @IsOptional()
  @Expose()
  DB_PASSWORD: string;

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
  @IsBooleanString()
  @Expose()
  DB_SYNCHRONIZE: 'true' | 'false';

  /** Set to true to drop the database schema on every startup.
   *  Definitely not to be used in production. */
  @IsBooleanString()
  @Expose()
  DB_DROP_SCHEMA: 'true' | 'false';

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
    this.DB_USERNAME = input?.DB_USERNAME;
    this.DB_PASSWORD = input?.DB_PASSWORD;
    this.DB_NAME = input?.DB_NAME;
    this.DB_SCHEMA = input?.DB_SCHEMA;
    this.DB_SYNCHRONIZE = input?.DB_SYNCHRONIZE;
    this.DB_DROP_SCHEMA = input?.DB_DROP_SCHEMA;
    this.JWT_SECRET = input?.JWT_SECRET;
    this.JWT_EXPIRATION = input?.JWT_EXPIRATION;
    this.LOG_LEVEL = input?.LOG_LEVEL;
    this.NODE_ENV = input?.NODE_ENV;
    this.PORT = input?.PORT;
  }
}

export let environment: Environment;

export function loadAndValidateEnvironment() {
  dotenv.config({
    path: process.env.DOTENV_CONFIG_PATH || '.env',
    debug: process.env.NODE_ENV === 'development'
  });

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
