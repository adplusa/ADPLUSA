import { Request, Response } from "express";
import mongoose from "mongoose";
import { GeneralSettingsSchema } from "../database/schemas/generalSettings.schema";

const GeneralSettingsModel = (mongoose.models.GeneralSettings ||
    mongoose.model(
        "GeneralSettings",
        GeneralSettingsSchema,
    )) as mongoose.Model<any>;

export const updateGeneralSettings = async (req: Request, res: Response) => {
    try {
        // Map frontend field names to backend schema field names
        const {
            siteName, // Frontend uses siteName
            siteTitle, // Backend uses siteTitle (for backward compatibility)
            siteDescription,
            contactEmail,
            footerText,
            headerLogo,
            footerLogo,
            favicon,
            customHeadTags,
        } = req.body;

        // Build update object with only provided fields
        const updateData: any = {};

        // Handle siteName/siteTitle mapping (frontend sends siteName, backend stores as siteTitle)
        if (siteName !== undefined) updateData.siteTitle = siteName;
        else if (siteTitle !== undefined) updateData.siteTitle = siteTitle;

        if (siteDescription !== undefined)
            updateData.siteDescription = siteDescription;
        if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
        if (footerText !== undefined) updateData.footerText = footerText;
        if (customHeadTags !== undefined)
            updateData.customHeadTags = customHeadTags;

        // Handle image fields - allow explicitly setting to null to remove
        if (headerLogo !== undefined) updateData.headerLogo = headerLogo;
        if (footerLogo !== undefined) updateData.footerLogo = footerLogo;
        if (favicon !== undefined) updateData.favicon = favicon;

        const settings = await GeneralSettingsModel.findOneAndUpdate(
            {},
            { $set: updateData },
            { upsert: true, new: true, runValidators: true },
        );

        // Map response to match frontend expected format
        const response = {
            success: true,
            data: {
                _id: settings._id,
                siteName: settings.siteTitle, // Map back to siteName for frontend
                siteDescription: settings.siteDescription,
                contactEmail: settings.contactEmail,
                footerText: settings.footerText,
                headerLogo: settings.headerLogo,
                footerLogo: settings.footerLogo,
                favicon: settings.favicon,
                customHeadTags: settings.customHeadTags,
                createdAt: settings.createdAt,
                updatedAt: settings.updatedAt,
            },
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error upserting general settings:", error);
        return res.status(500).json({
            success: false,
            error: { message: "Internal server error" },
        });
    }
};

// Alias for backward compatibility
export const upsertGeneralSettings = updateGeneralSettings;

export const getGeneralSettings = async (req: Request, res: Response) => {
    try {
        const settings = await GeneralSettingsModel.findOne({});
        if (!settings) {
            return res.status(404).json({
                success: false,
                error: { message: "General settings not found" },
            });
        }

        // Map response to match frontend expected format
        const response = {
            success: true,
            data: {
                _id: settings._id,
                siteName: settings.siteTitle, // Map siteTitle to siteName for frontend
                siteDescription: settings.siteDescription,
                contactEmail: settings.contactEmail,
                footerText: settings.footerText,
                headerLogo: settings.headerLogo,
                footerLogo: settings.footerLogo,
                favicon: settings.favicon,
                customHeadTags: settings.customHeadTags,
                createdAt: settings.createdAt,
                updatedAt: settings.updatedAt,
            },
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching general settings:", error);
        return res.status(500).json({
            success: false,
            error: { message: "Internal server error" },
        });
    }
};
