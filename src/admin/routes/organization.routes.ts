// routes/organization.routes.ts
import express from 'express';
import { registerOrganization } from '../controllers/organization.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/organizations', authenticateAdmin, registerOrganization);

export default router;
