import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
    validateProject,
    validateProjectUpdate,
    validateService,
    validateFAQ,
    validateAbout,
    validateContact,
} from "../middleware/validation.middleware";
import {
    createProject,
    updateProject,
    deleteProject,
} from "../controllers/project.controller";
import {
    createService,
    updateService,
    deleteService,
} from "../controllers/service.controller";
import {
    updateFAQ,
    updateAbout,
    updateContact,
} from "../controllers/content.controller";
import { updateGeneralSettings } from "../controllers/generalSettings.controller";
import { updateHomepage } from "../controllers/homepage.controller";
import { updateMainServicePage } from "../controllers/mainServicePage.controller";
import { updateProjectsPage } from "../controllers/projectsPage.controller";

const router = Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

/**
 * Project admin routes
 */

/**
 * @route   POST /api/admin/projects
 * @desc    Create new project
 * @access  Protected (Admin)
 */
router.post("/projects", validateProject, createProject);

/**
 * @route   PUT /api/admin/projects/:id
 * @desc    Update project
 * @access  Protected (Admin)
 */
router.put("/projects/:id", validateProjectUpdate, updateProject);

/**
 * @route   DELETE /api/admin/projects/:id
 * @desc    Delete project
 * @access  Protected (Admin)
 */
router.delete("/projects/:id", deleteProject);

/**
 * Service admin routes
 */

/**
 * @route   POST /api/admin/services
 * @desc    Create new service
 * @access  Protected (Admin)
 */
router.post("/services", validateService, createService);

/**
 * @route   PUT /api/admin/services/:id
 * @desc    Update service
 * @access  Protected (Admin)
 */
router.put("/services/:id", validateService, updateService);

/**
 * @route   DELETE /api/admin/services/:id
 * @desc    Delete service
 * @access  Protected (Admin)
 */
router.delete("/services/:id", deleteService);

/**
 * Content admin routes (singleton documents)
 */

/**
 * @route   PUT /api/admin/faq
 * @desc    Update FAQ data
 * @access  Protected (Admin)
 */
router.put("/faq", validateFAQ, updateFAQ);

/**
 * @route   PUT /api/admin/about
 * @desc    Update About page data
 * @access  Protected (Admin)
 */
router.put("/about", validateAbout, updateAbout);

/**
 * @route   PUT /api/admin/contact
 * @desc    Update Contact page data
 * @access  Protected (Admin)
 */
router.put("/contact", validateContact, updateContact);

/**
 * @route   PUT /api/admin/homepage
 * @desc    Update Homepage data
 * @access  Protected (Admin)
 */
router.put("/homepage", updateHomepage);

/**
 * @route   PUT /api/admin/general-settings
 * @desc    Update General Settings (singleton document)
 * @access  Protected (Admin)
 */
router.put("/general-settings", updateGeneralSettings);

/**
 * @route   PUT /api/admin/main-service-page
 * @desc    Update Main Service Page (singleton document)
 * @access  Protected (Admin)
 */
router.put("/main-service-page", updateMainServicePage);

/**
 * @route   PUT /api/admin/projects-page
 * @desc    Update Projects Page (singleton document)
 * @access  Protected (Admin)
 */
router.put("/projects-page", updateProjectsPage);

export default router;
