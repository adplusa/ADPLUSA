import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getMedia,
  getMediaById,
  registerMedia,
  updateMedia,
  deleteMedia
} from '../controllers/media.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/admin/media - Get all media
router.get('/', getMedia);

// GET /api/admin/media/:id - Get media by ID
router.get('/:id', getMediaById);

// POST /api/admin/media - Register media after presigned upload
router.post('/', registerMedia);

// PUT /api/admin/media/:id - Update media
router.put('/:id', updateMedia);

// DELETE /api/admin/media/:id - Delete media
router.delete('/:id', deleteMedia);

export default router;