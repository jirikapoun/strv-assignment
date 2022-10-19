import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { useContainer, useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { Container } from 'typeorm-typedi-extensions';
import {
  ContactController,
  ErrorHandlingMiddleware,
  openApiSpec,
  requestLoggingMiddleware,
  UserController,
} from './api';
import { authorizationChecker } from './common';
import { UserService } from './logic';

export const app = express();

app.use(requestLoggingMiddleware);
app.use(helmet());

useContainer(Container);
useExpressServer(app, {
  authorizationChecker: authorizationChecker(
    (userId) => Container.get(UserService).findById(userId)
  ),
  classTransformer: true,
  controllers: [
    ContactController,
    UserController
  ],
  cors: true,
  currentUserChecker: async (action) => {
    return action.request.user
  },
  defaultErrorHandler: false,
  defaults: {
    paramOptions: {
      required: true
    },
    undefinedResultCode: 204,
  },
  middlewares: [
    ErrorHandlingMiddleware
  ],
  validation: {
    forbidUnknownValues: true,
  }
})

app.use(compression());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec(), {
  customCss: '.swagger-ui .topbar, .swagger-ui .response-control-media-type { display: none } .swagger-ui .response-controls { padding-top: 0 }'
}));

export default app;
