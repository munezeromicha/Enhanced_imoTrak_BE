import express from 'express';
import dotenv from 'dotenv';
import { authRoutes } from './routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cron from 'node-cron';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // Allows all origins
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'API for authentication (login/logout)'
    },
    servers: [
      { url: 'https://auth-service-latest-35ie.onrender.com', description: 'Render Deployment' },
      { url: 'http://localhost:3000', description: 'Local Development' }
    ]
  },
  apis: ['./src/controllers/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/', (_req, res) => res.send('Auth Service Running'));

// Ping every 14 minutes (to be safe, before 15 min sleep)
cron.schedule('*/14 * * * *', async () => {
  try {
    const res = await fetch('https://auth-service-latest-35ie.onrender.com/');
    if (res.ok) {
      console.log('Self-ping successful');
    } else {
      console.log('Self-ping failed with status:', res.status);
    }
  } catch (error) {
    console.error('Self-ping error:', error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
