import { Router } from 'express';
import proxyMiddleware from '../middlewares/proxyMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'The gateway is live fam. Now services can talk each other.' });
});

// Proxy setup for the organization service
router.use('/organization', proxyMiddleware(process.env.ORGANIZATION_SERVICE_URL || ''));

// Proxy setup for the auth service
router.use('/organization', authMiddleware, proxyMiddleware(process.env.ORGANIZATION_SERVICE_URL || ''));
router.use('/auth', proxyMiddleware(process.env.AUTH_SERVICE_URL || ''));

// Then here we will add more routes for other services. Kko dufitemo nyinshi cne..

export default router;
