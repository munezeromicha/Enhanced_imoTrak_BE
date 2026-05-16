import { Router } from 'express';
import { createContact, getContacts, markAsRead } from '../controllers/contact.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route for submitting contacts
router.post('/', createContact);

// Protected routes for admins
router.get('/', authenticateToken, getContacts);
router.patch('/:id/read', authenticateToken, markAsRead);

export default router;
