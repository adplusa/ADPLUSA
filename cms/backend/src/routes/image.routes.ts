import { Router } from 'express';
import {
  uploadSingleImage,
  uploadMultipleImages,
  getImageById,
  listImages,
  deleteImage,
  deleteMultipleImages,
} from '../controllers/image.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload, handleMulterError } from '../middleware/upload.middleware';

const router = Router();

/**
 * @route   POST /api/admin/upload
 * @desc    Upload single image
 * @access  Protected
 */
router.post(
  '/upload',
  authenticateToken,
  upload.single('image'),
  handleMulterError,
  uploadSingleImage
);

/**
 * @route   POST /api/admin/upload/multiple
 * @desc    Upload multiple images
 * @access  Protected
 */
router.post(
  '/upload/multiple',
  authenticateToken,
  upload.array('images', 10), // Max 10 images at once
  handleMulterError,
  uploadMultipleImages
);

/**
 * @route   GET /api/admin/images
 * @desc    List images with pagination
 * @access  Protected
 */
router.get('/images', authenticateToken, listImages);

/**
 * @route   GET /api/admin/images/:id
 * @desc    Get image by ID
 * @access  Protected
 */
router.get('/images/:id', authenticateToken, getImageById);

/**
 * @route   DELETE /api/admin/images/:id
 * @desc    Delete image by ID
 * @access  Protected
 */
router.delete('/images/:id', authenticateToken, deleteImage);

/**
 * @route   DELETE /api/admin/images
 * @desc    Delete multiple images
 * @access  Protected
 */
router.delete('/images', authenticateToken, deleteMultipleImages);

export default router;
