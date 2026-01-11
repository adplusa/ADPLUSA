import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Image with dark mode support
 */
export interface IServiceImage {
  url: string;
  darkModeUrl?: string;
}

/**
 * Service feature interface
 */
export interface IServiceFeature {
  title: string;
  description: string;
}

/**
 * Service document interface
 */
export interface IService extends Document, BaseSchemaFields {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  bannerImage?: IServiceImage;
  features: IServiceFeature[];
  image?: IServiceImage;
}

/**
 * Service schema definition
 */
const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
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
    content: {
      type: String, // Rich text content stored as HTML
      trim: true,
    },
    bannerImage: {
      url: {
        type: String,
        trim: true,
      },
      darkModeUrl: {
        type: String,
        trim: true,
      },
    },
    features: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, 'Feature title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, 'Feature description cannot exceed 1000 characters'],
        },
      },
    ],
    image: {
      url: {
        type: String,
        trim: true,
      },
      darkModeUrl: {
        type: String,
        trim: true,
      },
    },
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(serviceSchema);

// Add indexes for common queries
serviceSchema.index({ createdAt: -1 }); // For sorting by date

// Pre-save middleware to ensure slug uniqueness
serviceSchema.pre('save', async function (next) {
  if (this.isModified('slug')) {
    const existingService = await Service.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingService) {
      throw new Error(`Service with slug "${this.slug}" already exists`);
    }
  }
  next();
});

/**
 * Service model
 */
export const Service = model<IService>('Service', serviceSchema);
