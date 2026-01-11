import { Router } from 'express';
import { getServices, getServiceBySlug } from '../controllers/service.controller';

const router = Router();

/**
 * @route   GET /api/services
 * @desc    Get all services
 * @access  Public
 */
router.get('/', getServices);

/**
 * @route   GET /api/services/:slug
 * @desc    Get single service by slug
 * @access  Public
 */
router.get('/:slug', getServiceBySlug);

export default router;
