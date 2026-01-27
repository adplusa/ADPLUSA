import { Schema, model, Document } from "mongoose";
import {
    BaseSchemaFields,
    baseSchemaOptions,
    addSEOFields,
} from "./base.schema";

/**
 * Media type for project gallery items
 */
export type ProjectMediaType = "image" | "video";

/**
 * Media interface for project images and videos
 */
export interface IProjectImage {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    type?: ProjectMediaType;
    thumbnailUrl?: string; // For video thumbnails
}

/**
 * Project detail (label-value pairs for specs)
 */
export interface IProjectDetail {
    label: string;
    value: string;
    items?: string[]; // Original items array for frontend compatibility
}

/**
 * Project image gallery
 */
export interface IProjectImageGallery {
    title?: string;
    images: IProjectImage[];
}

/**
 * Project document interface
 */
export interface IProject extends Document, BaseSchemaFields {
    title: string;
    slug: string;
    description?: string;

    // Main/Hero image
    mainImage?: IProjectImage;

    // Content
    introText?: string;
    moreContent?: string; // Rich text HTML

    // Project details (label-value pairs)
    projectDetails: IProjectDetail[];

    // Image galleries
    imageGalleries: IProjectImageGallery[];

    // Legacy images array (for backward compatibility)
    images: IProjectImage[];

    // Metadata
    category?: string;
    featured: boolean;
    order: number;
    link?: string;
}

/**
 * Image/Video sub-schema (reusable for media items)
 */
const imageSubSchema = {
    url: {
        type: String,
        trim: true,
    },
    alt: {
        type: String,
        trim: true,
    },
    width: {
        type: Number,
        min: 0,
    },
    height: {
        type: Number,
        min: 0,
    },
    type: {
        type: String,
        enum: ["image", "video"],
        default: "image",
    },
    thumbnailUrl: {
        type: String,
        trim: true,
    },
};

/**
 * Project schema definition
 */
const projectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        slug: {
            type: String,
            required: [true, "Project slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            match: [
                /^[a-z0-9-]+$/,
                "Slug can only contain lowercase letters, numbers, and hyphens",
            ],
        },
        description: {
            type: String,
            trim: true,
            // No maxlength - stores full introText for backward compatibility
        },

        // Main/Hero image
        mainImage: imageSubSchema,

        // Content
        introText: {
            type: String,
            trim: true,
            // No maxlength - stores full intro text from Sanity
        },
        moreContent: {
            type: String, // Rich text HTML
            trim: true,
        },

        // Project details (label-value pairs)
        projectDetails: [
            {
                label: {
                    type: String,
                    trim: true,
                    maxlength: [100, "Label cannot exceed 100 characters"],
                },
                value: {
                    type: String,
                    trim: true,
                },
                items: [
                    {
                        type: String,
                        trim: true,
                    },
                ],
            },
        ],

        // Image galleries
        imageGalleries: [
            {
                title: {
                    type: String,
                    trim: true,
                },
                images: [imageSubSchema],
            },
        ],

        // Legacy images array (for backward compatibility)
        images: [imageSubSchema],

        // Metadata
        category: {
            type: String,
            trim: true,
            index: true,
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
        order: {
            type: Number,
            default: 0,
            index: true,
        },
        link: {
            type: String,
            trim: true,
            match: [
                /(^$|^https?:\/\/.+|^\/.+)/,
                "Link must be a valid URL (http/https or relative starting with /)",
            ],
        },
    },
    baseSchemaOptions,
);

// Add SEO fields
addSEOFields(projectSchema);

// Add indexes for common queries
projectSchema.index({ createdAt: -1 });
projectSchema.index({ featured: 1, createdAt: -1 });
projectSchema.index({ order: 1, createdAt: -1 });

// Pre-save middleware to ensure slug uniqueness
projectSchema.pre("save", async function (next) {
    if (this.isModified("slug")) {
        const existingProject = await Project.findOne({
            slug: this.slug,
            _id: { $ne: this._id },
        });

        if (existingProject) {
            throw new Error(`Project with slug "${this.slug}" already exists`);
        }
    }
    next();
});

/**
 * Project model
 */
export const Project = model<IProject>("Project", projectSchema);
