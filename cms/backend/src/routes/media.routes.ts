import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia
} from '../controllers/media.controller';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, and documents
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// All routes require authentication
router.use(authenticateToken);

// GET /api/media - Get all media
router.get('/', getMedia);

// GET /api/media/:id - Get media by ID
router.get('/:id', getMediaById);

// POST /api/media - Upload new media
router.post('/', upload.single('file'), uploadMedia);

// PUT /api/media/:id - Update media
router.put('/:id', updateMedia);

// DELETE /api/media/:id - Delete media
router.delete('/:id', deleteMedia);

export default router;