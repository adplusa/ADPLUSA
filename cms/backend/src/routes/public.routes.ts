import { Router, Request, Response } from "express";
import { Homepage } from "../database/schemas/homepage.schema";
import { Project } from "../database/schemas/project.schema";
import { Service } from "../database/schemas/service.schema";
import { About } from "../database/schemas/about.schema";
import { Contact } from "../database/schemas/contact.schema";
import { FAQ } from "../database/schemas/faq.schema";
import { getGeneralSettings } from "../controllers/generalSettings.controller";
import { getMainServicePage } from "../controllers/mainServicePage.controller";
import { getProjectsPage } from "../controllers/projectsPage.controller";

const router = Router();

router.get("/homepage", async (_req: Request, res: Response): Promise<void> => {
    try {
        const homepage = await Homepage.findOne().lean();
        if (!homepage) { res.status(404).json({ success: false, error: "Homepage content not found" }); return; }
        res.status(200).json({ success: true, data: homepage });
    } catch (error) {
        console.error("Error fetching homepage:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/projects", async (req: Request, res: Response): Promise<void> => {
    try {
        const filter: any = {};
        if (req.query.featured === "true") filter.featured = true;
        const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean();
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/projects/:slug", async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findOne({ slug: req.params.slug }).lean();
        if (!project) { res.status(404).json({ success: false, error: `Project not found` }); return; }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/services", async (_req: Request, res: Response): Promise<void> => {
    try {
        const services = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/services/:slug", async (req: Request, res: Response): Promise<void> => {
    try {
        const service = await Service.findOne({ slug: req.params.slug }).lean();
        if (!service) { res.status(404).json({ success: false, error: `Service not found` }); return; }
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        console.error("Error fetching service:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/about", async (_req: Request, res: Response): Promise<void> => {
    try {
        const about = await About.findOne().lean();
        if (!about) { res.status(404).json({ success: false, error: "About page not found" }); return; }
        res.status(200).json({ success: true, data: about });
    } catch (error) {
        console.error("Error fetching about:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/contact", async (_req: Request, res: Response): Promise<void> => {
    try {
        const contact = await Contact.findOne().lean();
        if (!contact) { res.status(404).json({ success: false, error: "Contact page not found" }); return; }
        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/faq", async (_req: Request, res: Response): Promise<void> => {
    try {
        const faq = await FAQ.findOne().lean();
        if (!faq) { res.status(404).json({ success: false, error: "FAQ not found" }); return; }
        res.status(200).json({ success: true, data: faq });
    } catch (error) {
        console.error("Error fetching FAQ:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.get("/general-settings", getGeneralSettings);
router.get("/main-service-page", getMainServicePage);
router.get("/projects-page", getProjectsPage);

export default router;
