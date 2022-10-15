import { NextFunction, Request, Response } from 'express';
import { logger } from '../../common';

export default function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms ${req.path}`;
    logger.debug(message);
  });

  next();
}
