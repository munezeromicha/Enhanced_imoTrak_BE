import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import authRoutes from './src/auth/auth.routes';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Imotarak Backend API is live!');
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
