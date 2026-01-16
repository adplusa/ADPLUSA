import { Request, Response } from "express";
import { GeneralSettings } from "../database/schemas/generalSettings.schema";

/**
 * @route   GET /api/general-settings
 * @desc    Get general settings (singleton document)
 * @access  Public
 */
export const getGeneralSettings = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        // GeneralSettings is a singleton document, so we get the first one
        const settings = await GeneralSettings.findOne().lean();

        if (!settings) {
            // Return default empty settings if none exist
            res.status(200).json({
                success: true,
                data: {
                    headerLogo: null,
                    footerLogo: null,
                    favicon: null,
                    siteName: "ADPL Consulting LLC",
                    siteDescription: "",
                },
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error("Error fetching general settings:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to fetch general settings",
            },
        });
    }
};

/**
 * @route   PUT /api/admin/general-settings
 * @desc    Update general settings (singleton document)
 * @access  Protected (Admin)
 */
export const updateGeneralSettings = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const { headerLogo, footerLogo, favicon, siteName, siteDescription } =
            req.body;

        // Validate image URLs if provided - must be valid URLs
        const validateImageUrl = (image: any): boolean => {
            if (!image || !image.url) return true; // Empty/null is allowed
            // If it's an object with a URL, validate it
            try {
                // If it's a relative URL, it might fail new URL().
                // However, our S3 util returns full URLs.
                // We'll be flexible: if it starts with http or /, it's probably okay.
                if (image.url.startsWith("/") || image.url.startsWith("http")) {
                    return true;
                }
                new URL(image.url);
                return true;
            } catch {
                return false;
            }
        };

        if (!validateImageUrl(headerLogo)) {
            res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Header logo must have a valid URL",
                },
            });
            return;
        }

        if (!validateImageUrl(footerLogo)) {
            res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Footer logo must have a valid URL",
                },
            });
            return;
        }

        if (!validateImageUrl(favicon)) {
            res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Favicon must have a valid URL",
                },
            });
            return;
        }

        // Prepare update object
        const updateData: any = {};
        if (headerLogo !== undefined) updateData.headerLogo = headerLogo;
        if (footerLogo !== undefined) updateData.footerLogo = footerLogo;
        if (favicon !== undefined) updateData.favicon = favicon;
        if (siteName !== undefined) updateData.siteName = siteName;
        if (siteDescription !== undefined)
            updateData.siteDescription = siteDescription;



        // Use findOneAndUpdate with upsert to ensure we always have one document
        // and it gets updated correctly.
        const settings = await GeneralSettings.findOneAndUpdate(
            {}, // Empty filter because it's a singleton
            { $set: updateData },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).lean();



        res.status(200).json({
            success: true,
            data: settings,
            message: "General settings updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating general settings:", error);

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
                message: "Failed to update general settings",
                details: error.message,
            },
        });
    }
};
