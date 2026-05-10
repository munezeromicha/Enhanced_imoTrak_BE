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
import { autoMigrateIfNeeded } from './src/utils/autoMigrate';

dotenv.config();

const app = express();

// Configure CORS to allow frontend origins
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://imotrak.ur.ac.rw'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true
}));

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

async function start() {
  await autoMigrateIfNeeded();

  app.listen(PORT, () => {
    console.log(`Server is running at ${baseUrl}`);
    console.log(`For documentation hit : ${baseUrl}/api-docs`);

    startTokenCleanupScheduler();
  });
}

start().catch((err) => {
  console.error('Startup failed:', err?.message || err);
  if (err?.cause) {
    const cause: any = err.cause;
    if (cause?.stdout) console.error('cause stdout:\n' + cause.stdout.toString());
    if (cause?.stderr) console.error('cause stderr:\n' + cause.stderr.toString());
  }
  process.exit(1);
});


setInterval(() => {
  fetch(`${baseUrl}/`)
    .then(res => res.text())
    .then(txt => console.log(`Pinged /: ${txt}`))
    .catch(err => console.error(`Ping failed: ${err.message}`));
}, 5 * 60 * 1000);
