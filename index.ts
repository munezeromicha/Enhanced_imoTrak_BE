import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Request, Response } from 'express';
import { swaggerUi, swaggerSpec } from './src/utils/swagger';

dotenv.config();

const app = express();


// Allow all origins
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(morgan('short'));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.send('Imotarak Backend API is live!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at ${baseUrl}`);
});

const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;