import express from 'express';
import { registerOrganization } from '../controllers/organization.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/organizations', authenticate, registerOrganization);

export default router;
