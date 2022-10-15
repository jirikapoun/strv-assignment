import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { useContainer, useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { Container } from 'typeorm-typedi-extensions';
import UserController from './api/controller/user.controller';
import requestLoggingMiddleware from './api/middleware/request-logging.middleware';
import openapiSchema from './api/openapi.util';

const app = express();

app.use(requestLoggingMiddleware);
app.use(helmet());

useContainer(Container);
useExpressServer(app, {
  classTransformer: true,
  controllers: [
    UserController
  ],
  cors: true,
  defaults: {
    paramOptions: {
      required: true
    },
    undefinedResultCode: 204,
  },
  validation: {
    forbidUnknownValues: true,
  }
})

app.use(compression());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSchema, {
  customCss: '.swagger-ui .topbar { display: none }'
}));

export default app;
