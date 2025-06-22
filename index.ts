import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Request, Response } from 'express';
import { swaggerUi, swaggerSpec } from './utils/swagger';
import { errorHandler } from './src/middleware/errorHandler';
import routes from './src/index.routes';
import { seedAdmin } from './utils/seedAdmin';
import { checkEnvironmentVariables } from './utils/envChecker';
dotenv.config();

const app = express();


// Allow all origins
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(morgan('short'));

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.send('Imotarak Backend API is live!');
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

const startServer = async () => {
  // Check environment variables first
  checkEnvironmentVariables();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🌱 Seeding admin data for development...');
    await seedAdmin();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${baseUrl}`);
    console.log(`📚 Swagger docs at ${baseUrl}/api-docs`);
  });
};

startServer();
