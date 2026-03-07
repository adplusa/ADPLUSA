import { Schema, model, Document } from "mongoose";
import { BaseSchemaFields, baseSchemaOptions } from "./base.schema";

export interface ISettingsImage {
    url: string;
    alt?: string;
}

export interface IGeneralSettings extends Document, BaseSchemaFields {
    siteTitle: string;
    siteDescription: string;
    contactEmail: string;
    footerText: string;
    copyrightYear?: number;
    headerLogo?: ISettingsImage;
    footerLogo?: ISettingsImage;
    favicon?: ISettingsImage;
    customHeadTags?: string;
}

const imageSubSchema = {
    url: { type: String, trim: true },
    alt: { type: String, trim: true },
};

export const GeneralSettingsSchema = new Schema<IGeneralSettings>(
    {
        siteTitle: {
            type: String,
            default: "ADPL Consulting",
        },
        siteDescription: {
            type: String,
            default: "",
        },
        contactEmail: {
            type: String,
            default: "",
        },
        footerText: {
            type: String,
            default: "",
        },
        copyrightYear: {
            type: Number,
            default: new Date().getFullYear(),
        },
        headerLogo: imageSubSchema,
        footerLogo: imageSubSchema,
        favicon: imageSubSchema,
        customHeadTags: {
            type: String,
            default: "",
        },
    },
    baseSchemaOptions,
);

export const GeneralSettings = model<IGeneralSettings>(
    "GeneralSettings",
    GeneralSettingsSchema,
);

export default GeneralSettingsSchema;
