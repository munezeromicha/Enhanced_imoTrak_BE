import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './src/middlewares/errorHandler';

import { swaggerUi, swaggerSpec } from './src/utils/swagger';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('short'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req: Request, res: Response) => {
  res.send('Imotarak Backend API is live!');
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
console.log(`🚀 Server running on ${baseUrl}`);
console.log(`📚 Swagger docs at ${baseUrl}/api-docs`);
});
