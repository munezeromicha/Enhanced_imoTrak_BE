import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Request, Response } from 'express';
import { swaggerUi, swaggerSpec } from './utils/swagger';
import { errorHandler } from './src/middleware/errorHandler'


import routes from './src/index.routes';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(morgan('short')); // We can also use 'combined', 'dev', 'tiny', etc.


app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req: Request, res: Response) => {
  res.send('Imotarak Backend API is live!');
});

app.use(errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  console.log(`🚀 Server running on ${baseUrl}`);
  console.log(`📚 Swagger docs available at ${baseUrl}/api-docs`);
});
