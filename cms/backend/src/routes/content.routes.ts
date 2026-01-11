import { Router } from 'express';
import { getFAQ, getAbout, getContact } from '../controllers/content.controller';

const router = Router();

/**
 * @route   GET /api/faq
 * @desc    Get FAQ data
 * @access  Public
 */
router.get('/faq', getFAQ);

/**
 * @route   GET /api/about
 * @desc    Get About page data
 * @access  Public
 */
router.get('/about', getAbout);

/**
 * @route   GET /api/contact
 * @desc    Get Contact page data
 * @access  Public
 */
router.get('/contact', getContact);

export default router;
