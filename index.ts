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

// Configure CORS to allow frontend origins.
// In production, only origins listed in CORS_ORIGINS (or the defaults) are
// accepted. In development, any localhost/127.0.0.1 origin is also accepted
// regardless of port, so `npm run dev` falling back to a non-3000 port (or
// hitting the API via 127.0.0.1) doesn't break the app.
const allowedOrigins = (
  process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'https://api.imotrak.michaelmunezero.com']
).map((o) => o.trim()).filter(Boolean);

const isDev = process.env.NODE_ENV !== 'production';
const localhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

app.use(cors({
  origin: (origin, callback) => {
    // No-origin requests (curl, server-to-server, same-origin fetches).
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    if (isDev && localhostOrigin.test(origin)) {
      callback(null, true);
      return;
    }
    console.warn(
      `[cors] rejected origin "${origin}". Allowed: ${allowedOrigins.join(', ') || '(none)'}`,
    );
    callback(new Error(`CORS policy: Origin "${origin}" not allowed`));
  },
  credentials: true
}));

app.use(
  helmet({
    // EventSource/SSE from the Next.js app needs cross-origin access to this API.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(express.json());
app.use(morgan('short'));

// Support both /v2 and /api/v2 (production reverse proxy often keeps the /api prefix).
app.use('/v2', auditLogger, routes);
app.use('/api/v2', auditLogger, routes);
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
