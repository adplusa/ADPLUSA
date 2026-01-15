import { Schema, model, Document } from "mongoose";
import { BaseSchemaFields, baseSchemaOptions } from "./base.schema";

/**
 * Image interface for settings images
 */
export interface ISettingsImage {
    url: string;
    alt?: string;
}

/**
 * General Settings document interface
 * Note: This is a singleton document (only one GeneralSettings document should exist)
 */
export interface IGeneralSettings extends Document, BaseSchemaFields {
    // Logo Images
    headerLogo?: ISettingsImage;
    footerLogo?: ISettingsImage;
    favicon?: ISettingsImage;

    // Site metadata (optional, for future extensibility)
    siteName?: string;
    siteDescription?: string;
    customHeadTags?: string;
}

/**
 * Image sub-schema (reusable)
 */
const imageSubSchema = {
    url: {
        type: String,
        trim: true,
        maxlength: [2000, "URL cannot exceed 2000 characters"],
    },
    alt: {
        type: String,
        trim: true,
        maxlength: [200, "Alt text cannot exceed 200 characters"],
    },
};

/**
 * General Settings schema definition
 */
const generalSettingsSchema = new Schema<IGeneralSettings>(
    {
        // Logo Images
        headerLogo: imageSubSchema,
        footerLogo: imageSubSchema,
        favicon: imageSubSchema,

        // Site metadata
        siteName: {
            type: String,
            trim: true,
            maxlength: [200, "Site name cannot exceed 200 characters"],
            default: "ADPL Consulting LLC",
        },
        siteDescription: {
            type: String,
            trim: true,
            maxlength: [500, "Site description cannot exceed 500 characters"],
        },
        customHeadTags: {
            type: String,
            trim: true,
            default: "",
        },
    },
    baseSchemaOptions
);

/**
 * General Settings model
 */
export const GeneralSettings = model<IGeneralSettings>(
    "GeneralSettings",
    generalSettingsSchema
);
