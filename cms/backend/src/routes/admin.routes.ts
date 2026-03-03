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
    getProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
} from "../controllers/project.controller";
import {
    getServices,
    getServiceBySlug,
    createService,
    updateService,
    deleteService,
} from "../controllers/service.controller";
import {
    getFAQ,
    getAbout,
    getContact,
    updateFAQ,
    updateAbout,
    updateContact,
} from "../controllers/content.controller";
import { getGeneralSettings, updateGeneralSettings } from "../controllers/generalSettings.controller";
import { getHomepage, updateHomepage } from "../controllers/homepage.controller";
import { getMainServicePage, updateMainServicePage } from "../controllers/mainServicePage.controller";
import { getProjectsPage, updateProjectsPage } from "../controllers/projectsPage.controller";

const router = Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

/**
 * Project admin routes
 */
router.get("/projects", getProjects);
router.get("/projects/:slug", getProjectBySlug);
router.post("/projects", validateProject, createProject);
router.put("/projects/:id", validateProjectUpdate, updateProject);
router.delete("/projects/:id", deleteProject);

/**
 * Service admin routes
 */
router.get("/services", getServices);
router.get("/services/:slug", getServiceBySlug);
router.post("/services", validateService, createService);
router.put("/services/:id", validateService, updateService);
router.delete("/services/:id", deleteService);

/**
 * Content admin routes (singleton documents)
 */
router.get("/faq", getFAQ);
router.put("/faq", validateFAQ, updateFAQ);

router.get("/about", getAbout);
router.put("/about", validateAbout, updateAbout);

router.get("/contact", getContact);
router.put("/contact", updateContact);

router.get("/homepage", getHomepage);
router.put("/homepage", updateHomepage);

router.get("/general-settings", getGeneralSettings);
router.put("/general-settings", updateGeneralSettings);

router.get("/main-service-page", getMainServicePage);
router.put("/main-service-page", updateMainServicePage);

router.get("/projects-page", getProjectsPage);
router.put("/projects-page", updateProjectsPage);

export default router;
