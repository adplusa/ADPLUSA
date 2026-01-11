import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Image interface for project images
 */
export interface IProjectImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Project document interface
 */
export interface IProject extends Document, BaseSchemaFields {
  title: string;
  slug: string;
  description?: string;
  images: IProjectImage[];
  category?: string;
  featured: boolean;
  link?: string;
}

/**
 * Project schema definition
 */
const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true, // Index for faster queries
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
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
      },
    ],
    category: {
      type: String,
      trim: true,
      index: true, // Index for filtering by category
    },
    featured: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering featured projects
    },
    link: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Link must be a valid URL'],
    },
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(projectSchema);

// Add indexes for common queries
projectSchema.index({ createdAt: -1 }); // For sorting by date
projectSchema.index({ featured: 1, createdAt: -1 }); // For featured projects sorted by date

// Pre-save middleware to ensure slug uniqueness
projectSchema.pre('save', async function (next) {
  if (this.isModified('slug')) {
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
export const Project = model<IProject>('Project', projectSchema);
