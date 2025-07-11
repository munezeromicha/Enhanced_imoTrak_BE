import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';

import { swaggerUi, swaggerSpec } from './utils/swagger';
import helmet from 'helmet';
import router from './routes/index.routes';
import cron from 'node-cron'; // Importing node-cron for cron job
import axios from 'axios'; // For making the ping request

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan('short'));

// Routes
app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ping route to keep the server awake
app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is awake!' });
});

// Global error handler
app.use(errorHandler);


const PORT = process.env.PORT || 4000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

// Cron job to ping the server every 14 minutes to keep it awake
cron.schedule('*/14 * * * *', () => {
  console.log(baseUrl);
  axios.get(baseUrl)
    .then(response => {
      console.log('Pinged server to keep it awake:');
    })
    .catch(error => {
      console.error('Error pinging server:', error);
    });
});

// Start server

app.listen(PORT, () => {
  console.log(`🚀 Organisation service Server running on ${baseUrl}`);
  console.log(`📚 Swagger docs at ${baseUrl}/api-docs`);
});
