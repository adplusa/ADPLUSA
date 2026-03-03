import { Request, Response } from "express";
import { Homepage } from "../database/schemas/homepage.schema";
import { CacheService } from "../services/cache.service";

/**
 * @route   GET /api/admin/homepage
 * @desc    Get homepage data
 * @access  Protected (Admin)
 */
export const getHomepage = async (
    _req: Request,
    res: Response,
): Promise<void> => {
    try {
        const homepage = await Homepage.findOne().lean();
        if (!homepage) {
            res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Homepage not found" } });
            return;
        }
        res.status(200).json({ success: true, data: homepage });
    } catch (error: any) {
        console.error("Error fetching homepage:", error);
        res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch homepage" } });
    }
};

/**
 * @route   PUT /api/admin/homepage
 * @desc    Update homepage (singleton document)
 * @access  Protected (Admin)
 */
export const updateHomepage = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const homepage = await Homepage.findOneAndUpdate(
            {},
            { $set: req.body },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            },
        ).lean();

        await CacheService.invalidateHomepage();

        res.status(200).json({
            success: true,
            data: homepage,
            message: "Homepage updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating homepage:", error);

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
