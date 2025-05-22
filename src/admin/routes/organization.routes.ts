import express from 'express';
import { registerOrganization } from '../controllers/organization.controller';

const router = express.Router();

router.post('/organizations', registerOrganization);

export default router;
