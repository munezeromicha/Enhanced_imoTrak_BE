import { Router } from 'express';
import proxyMiddleware from '../middlewares/proxyMiddleware';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  return({ status: 'The gateway is live fam' });
});

// Proxy setup for the organization service
router.use('/organization', proxyMiddleware(process.env.ORGANIZATION_SERVICE_URL || ''));

// Proxy setup for the auth service
router.use('/auth', proxyMiddleware(process.env.AUTH_SERVICE_URL || ''));

// Then here we will add more routes for other services. Kko dufitemo nyinshi cne..

export default router;
