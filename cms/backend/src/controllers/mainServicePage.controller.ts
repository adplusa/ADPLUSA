import { Request, Response } from "express";
import { MainServicePage } from "../database/schemas/mainServicePage.schema";

/**
 * @route   GET /api/public/main-service-page
 * @desc    Get main service page content (singleton document)
 * @access  Public
 */
export const getMainServicePage = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        // MainServicePage is a singleton document, so we get the first one
        const mainServicePage = await MainServicePage.findOne().lean();

        if (!mainServicePage) {
            res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Main service page content not found",
                },
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: mainServicePage,
        });
    } catch (error) {
        console.error("Error fetching main service page:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to fetch main service page content",
            },
        });
    }
};

/**
 * @route   PUT /api/admin/main-service-page
 * @desc    Update main service page (singleton document)
 * @access  Protected (Admin)
 */
export const updateMainServicePage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        console.log("Updating main service page...");

        // Use findOneAndUpdate with upsert to ensure we always have one document
        // This handles the singleton pattern (create if not exists)
        const mainServicePage = await MainServicePage.findOneAndUpdate(
            {}, // Empty filter because it's a singleton
            { $set: req.body },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).lean();

        console.log("Main service page updated successfully");

        res.status(200).json({
            success: true,
            data: mainServicePage,
            message: "Main service page updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating main service page:", error);

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
                message: "Failed to update main service page",
                details: error.message,
            },
        });
    }
};
