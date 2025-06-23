import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Imotrak API',
      version: '1.0.0',
      description: 'API documentation for Imotrak Backend',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
      },
      {
        url: 'https://imotrak-backside-lah2.onrender.com/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    }
  },
  apis: ['src/**/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
