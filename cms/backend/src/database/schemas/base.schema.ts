import { Schema } from "mongoose";

/**
 * Interface for structured meta tags with name and content fields
 */
export interface IMetaTag {
    name: string;
    content: string;
}

/**
 * Meta tag sub-schema for use in other schemas
 */
export const metaTagSchema = {
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
};

/**
 * Base schema fields that are common to all content types
 */
export interface BaseSchemaFields {
    createdAt: Date;
    updatedAt: Date;
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string; // Kept for backward compatibility during migration
    metaTags?: IMetaTag[];
}

/**
 * Base schema options with timestamps
 */
export const baseSchemaOptions = {
    timestamps: true, // Automatically adds createdAt and updatedAt
};

/**
 * Add SEO fields to a schema
 */
export function addSEOFields(schema: Schema): void {
    schema.add({
        seoTitle: {
            type: String,
            trim: true,
        },
        seoDescription: {
            type: String,
            trim: true,
        },
        customHeadTags: {
            type: String,
            trim: true,
            default: "",
        },
        metaTags: {
            type: [metaTagSchema],
            default: [],
        },
    });
}
