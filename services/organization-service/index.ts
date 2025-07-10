import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './src/middlewares/errorHandler';

import { swaggerUi, swaggerSpec } from './src/utils/swagger';
import helmet from 'helmet';
import router from './src/routes/org.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(helmet())
app.use(express.json());
app.use(morgan('short'));

app.use(router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
console.log(`🚀 Organisation service Server running on ${baseUrl}`);
console.log(`📚 Swagger docs at ${baseUrl}/api-docs`);
});
