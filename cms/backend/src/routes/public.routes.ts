import { Router, Request, Response } from 'express';
import { Homepage } from '../database/schemas/homepage.schema';
import { Project } from '../database/schemas/project.schema';
import { Service } from '../database/schemas/service.schema';
import { About } from '../database/schemas/about.schema';
import { Contact } from '../database/schemas/contact.schema';
import { FAQ } from '../database/schemas/faq.schema';

const router = Router();

/**
 * @route   GET /api/public/homepage
 * @desc    Get homepage content (singleton document)
 * @access  Public
 */
router.get('/homepage', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Homepage is a singleton document
    const homepage = await Homepage.findOne().lean();

    if (!homepage) {
      res.status(404).json({
        success: false,
        error: 'Homepage content not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: homepage,
    });
  } catch (error) {
    console.error('Error fetching homepage:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/public/projects
 * @desc    Get all projects sorted by order
 * @access  Public
 */
router.get('/projects', async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/public/projects/:slug
 * @desc    Get single project by slug
 * @access  Public
 */
router.get('/projects/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug }).lean();

    if (!project) {
      res.status(404).json({
        success: false,
        error: `Project with slug "${slug}" not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/public/services
 * @desc    Get all services sorted by order
 * @access  Public
 */
router.get('/services', async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/public/services/:slug
 * @desc    Get single service by slug
 * @access  Public
 */
router.get('/services/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const service = await Service.findOne({ slug }).lean();

    if (!service) {
      res.status(404).json({
        success: false,
        error: `Service with slug "${slug}" not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/public/about
 * @desc    Get about page content (singleton document)
 * @access  Public
 */
router.get('/about', async (_req: Request, res: Response): Promise<void> => {
  try {
    // About is a singleton document
    const about = await About.findOne().lean();

    if (!about) {
      res.status(404).json({
        success: false,
        error: 'About page content not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error('Error fetching about page:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/public/contact
 * @desc    Get contact page content (singleton document)
 * @access  Public
 */
router.get('/contact', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Contact is a singleton document
    const contact = await Contact.findOne().lean();

    if (!contact) {
      res.status(404).json({
        success: false,
        error: 'Contact page content not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact page:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/public/faq
 * @desc    Get FAQ content (singleton document)
 * @access  Public
 */
router.get('/faq', async (_req: Request, res: Response): Promise<void> => {
  try {
    // FAQ is a singleton document
    const faq = await FAQ.findOne().lean();

    if (!faq) {
      res.status(404).json({
        success: false,
        error: 'FAQ content not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
