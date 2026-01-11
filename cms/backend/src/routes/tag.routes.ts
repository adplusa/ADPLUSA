import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tag.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/tags - Get all tags
router.get('/', getTags);

// GET /api/tags/:id - Get tag by ID
router.get('/:id', getTagById);

// POST /api/tags - Create new tag
router.post('/', createTag);

// PUT /api/tags/:id - Update tag
router.put('/:id', updateTag);

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', deleteTag);

export default router;