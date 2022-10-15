import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { useContainer, useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { Container } from 'typeorm-typedi-extensions';
import { ContactController, openApiSpec, requestLoggingMiddleware, UserController } from './api';

const app = express();

app.use(requestLoggingMiddleware);
app.use(helmet());

useContainer(Container);
useExpressServer(app, {
  classTransformer: true,
  controllers: [
    ContactController,
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customCss: '.swagger-ui .topbar { display: none }'
}));

export default app;
