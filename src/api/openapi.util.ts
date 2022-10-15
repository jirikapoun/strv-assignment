import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { ResponsesObject } from 'openapi3-ts';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

const refPointerPrefix = `#/components/schemas/`;

export const badRequestResponse: ResponsesObject = {
  '400': {
    description: 'Invalid request - see actual response for details',
  }
};

export const unauthorizedResponse: ResponsesObject = {
  '401': {
      description: 'Unauthorized - authentication is invalid or missing, log in again',
  }
};

export function responseWithPayload(statusCode: string, description: string, payloadType: string): ResponsesObject {
  return {
    [statusCode]: {
      description,
      content: {
        'application/json': {
          schema: {
            $ref: `${refPointerPrefix}${payloadType}`,
          }
        }
      }
    },
  };
}

const openapiSchema = routingControllersToSpec(
  getMetadataArgsStorage(),
  {},
  {
    info: {
      title: 'My app',
      version: '1.2.0',
    },
    components: {
      schemas: validationMetadatasToSchemas({
        refPointerPrefix,
      }),
    },
  },
);
export default openapiSchema;
