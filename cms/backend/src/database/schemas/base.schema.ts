import { Schema } from "mongoose";

/**
 * Base schema fields that are common to all content types
 */
export interface BaseSchemaFields {
    createdAt: Date;
    updatedAt: Date;
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
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
    });
}
