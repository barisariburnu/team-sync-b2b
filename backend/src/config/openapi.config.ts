import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './app.config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Umay API',
      version: '1.0.0',
      description: 'API documentation for v1 routes',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || config.PORT}${config.BASE_PATH}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/organizations': {
        get: {
          summary: 'List organizations',
          tags: ['Organizations'],
          responses: {
            200: { description: 'OK' },
          },
        },
        post: {
          summary: 'Create organization',
          tags: ['Organizations'],
          responses: {
            201: { description: 'Created' },
          },
        },
      },
      '/organizations/{id}': {
        get: {
          summary: 'Get organization by id',
          tags: ['Organizations'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            404: { description: 'Not Found' },
          },
        },
        patch: {
          summary: 'Update organization',
          tags: ['Organizations'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            404: { description: 'Not Found' },
          },
        },
        delete: {
          summary: 'Delete organization',
          tags: ['Organizations'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'No Content' },
            404: { description: 'Not Found' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
