import { Router } from 'express';
import { createContact, getContacts, markAsRead } from '../controllers/contact.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';

const router = Router();

// Public route for submitting contacts
router.post('/', createContact);

// Protected routes for hub SuperAdmin (needs position_access from DB)
router.get('/', authenticateToken, attachPositionAccess, getContacts);
router.patch('/:id/read', authenticateToken, attachPositionAccess, markAsRead);

export default router;
