/**
 * Utility classes and objects used throughout the entire application.
 */

export { default as DuplicateEmailError } from './error/duplicate-email.error';
export { default as NotImplementedError } from './error/not-implemented.error';

export { default as logger } from './logging/logger';

export * from './type.util';
export * from './error.util';
