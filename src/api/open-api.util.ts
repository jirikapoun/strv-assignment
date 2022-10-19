import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { ResponsesObject } from 'openapi3-ts';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as packageJson from '../../package.json';

const refPointerPrefix = `#/components/schemas/`;

export const jwtSecurity = {
  security: [{ jwt: [] }]
}

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

export const openApiSpec = () => {
  const schemas = validationMetadatasToSchemas({ refPointerPrefix });
  for (const schema in schemas) {
    if (!schema.endsWith('Request') && !schema.endsWith('Response')) {
      delete schemas[schema];
    }
  }
  return routingControllersToSpec(
    getMetadataArgsStorage(),
    {},
    {
      info: {
        title: packageJson.summary,
        version: packageJson.version,
      },
      components: {
        schemas,
        securitySchemes: {
          jwt: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
    },
  );
}
