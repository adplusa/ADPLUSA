import { Request, Response } from "express";
import { Homepage } from "../database/schemas/homepage.schema";

/**
 * @route   PUT /api/admin/homepage
 * @desc    Update homepage (singleton document)
 * @access  Protected (Admin)
 */
export const updateHomepage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        console.log("Updating homepage...");

        // Use findOneAndUpdate with upsert to ensure we always have one document
        const homepage = await Homepage.findOneAndUpdate(
            {}, // Empty filter because it's a singleton
            { $set: req.body },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).lean();

        console.log("Homepage updated successfully");

        res.status(200).json({
            success: true,
            data: homepage,
            message: "Homepage updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating homepage:", error);

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
                message: "Failed to update homepage",
                details: error.message,
            },
        });
    }
};
