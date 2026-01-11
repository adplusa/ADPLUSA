import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getPresignedUploadUrl,
  getPresignedUploadUrls,
} from '../controllers/presigned.controller';

const router = Router();

// All presigned URL routes require authentication
router.use(authenticateToken);

// Generate presigned URL for single file upload
router.post('/presigned-upload', getPresignedUploadUrl);

// Generate presigned URLs for multiple file uploads
router.post('/presigned-upload/batch', getPresignedUploadUrls);

export default router;
