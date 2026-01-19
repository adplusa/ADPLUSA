import { Request, Response } from "express";
import { ProjectsPage } from "../database/schemas/projectsPage.schema";

/**
 * @route   GET /api/public/projects-page
 * @desc    Get projects page content (singleton document)
 * @access  Public
 */
export const getProjectsPage = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        // ProjectsPage is a singleton document, so we get the first one
        const projectsPage = await ProjectsPage.findOne().lean();

        if (!projectsPage) {
            res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Projects page content not found",
                },
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: projectsPage,
        });
    } catch (error) {
        console.error("Error fetching projects page:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to fetch projects page content",
            },
        });
    }
};

/**
 * @route   PUT /api/admin/projects-page
 * @desc    Update projects page (singleton document)
 * @access  Protected (Admin)
 */
export const updateProjectsPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        console.log("Updating projects page...");

        // Use findOneAndUpdate with upsert to ensure we always have one document
        // This handles the singleton pattern (create if not exists)
        const projectsPage = await ProjectsPage.findOneAndUpdate(
            {}, // Empty filter because it's a singleton
            { $set: req.body },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).lean();

        console.log("Projects page updated successfully");

        res.status(200).json({
            success: true,
            data: projectsPage,
            message: "Projects page updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating projects page:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            const validationErrors: any = {};
            Object.keys(error.errors).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
            });

            res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Validation failed",
                    details: validationErrors,
                },
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to update projects page",
                details: error.message,
            },
        });
    }
};
