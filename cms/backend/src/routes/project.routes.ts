import { Router } from 'express';
import { getProjects, getProjectBySlug } from '../controllers/project.controller';

const router = Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects with pagination and filtering
 * @access  Public
 */
router.get('/', getProjects);

/**
 * @route   GET /api/projects/:slug
 * @desc    Get single project by slug
 * @access  Public
 */
router.get('/:slug', getProjectBySlug);

export default router;
