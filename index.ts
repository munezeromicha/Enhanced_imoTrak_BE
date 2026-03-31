import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import { Request, Response } from 'express';
import { swaggerUi, swaggerSpec } from './src/utils/swagger';
import { errorHandler } from './src/middlewares/errorHandler';
import { auditLogger } from './src/middlewares/auditLogger.middleware';
import routes from './src/routes';
import { startTokenCleanupScheduler } from './src/utils/tokenCleanup';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan('short'));

app.use('/v2', auditLogger, routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.send('Imotarak Backend API is live!');
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server is running at ${baseUrl}`);
  console.log(`For documentation hit : ${baseUrl}/api-docs`);

  startTokenCleanupScheduler();
});


setInterval(() => {
  fetch(`${baseUrl}/`)
    .then(res => res.text())
    .then(txt => console.log(`Pinged /: ${txt}`))
    .catch(err => console.error(`Ping failed: ${err.message}`));
}, 5 * 60 * 1000);
