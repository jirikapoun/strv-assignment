/**
 * Serves as the presentation layer of the application - implements the API which is consumed by users.
 */

export { default as ContactController } from './controller/contact.controller';
export { default as UserController } from './controller/user.controller';

export { default as ErrorHandlingMiddleware } from './middleware/error-handling.middleware';
export { default as requestLoggingMiddleware } from './middleware/request-logging.middleware';

export { openApiSpec } from './open-api.util';
