import express from 'express';
import {
  ExpressErrorMiddlewareInterface,
  InternalServerError,
  Middleware,
} from 'routing-controllers';
import { environment, logger } from '../../common';

const unimportantCodes: Record<number, true> = {
  401: true,
  403: true
};

@Middleware({ type: 'after' })
export default class ErrorHandlingMiddleware implements ExpressErrorMiddlewareInterface {

  public error(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ): void {
    const productionMode: boolean = environment.NODE_ENV === 'production';
    if (error.httpCode && typeof error.httpCode === 'number') {
      if (error.httpCode < 400 || unimportantCodes[error.httpCode]) {
        logger.debug(`Request resolved with ${error.httpCode} status`, error);
      } else if (error.httpCode < 500) {
        logger.notice('Could not process user request', error);
      } else {
        logger.warning(`Server error occured during request procesing`, error);
      }
      response
        .status(error.httpCode)
        .json({
          ...error,
          stack: productionMode ? undefined : error?.stack,
        })
    } else {
      logger.error('Unexpected error thrown during request processing', error);
      response
        .status(500)
        .json(productionMode
            ? new InternalServerError('Unexpected error thrown during request processing')
            : error);
    }
  }
}
