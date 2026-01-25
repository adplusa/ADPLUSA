import { Router } from 'express';
import { handleContactSync } from '../controllers/contact.controller';

const router = Router();

// This MUST match the frontend call exactly
// If the frontend calls /api/contact/sync, this should just be '/sync'
router.post('/sync', handleContactSync);

export default router;