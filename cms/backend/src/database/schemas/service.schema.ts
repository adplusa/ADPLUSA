import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Image interface
 */
export interface IServiceImage {
  url: string;
  alt?: string;
}

/**
 * Service feature interface (legacy)
 */
export interface IServiceFeature {
  title: string;
  description: string;
}

/**
 * Service item (for services list)
 */
export interface IServiceItem {
  title: string;
  description: string;
  image?: IServiceImage;
  link?: string;
  isExternal: boolean;
  order: number;
}

/**
 * Key activity
 */
export interface IKeyActivity {
  title: string;
  description: string;
  order: number;
}

/**
 * Service document interface
 */
export interface IService extends Document, BaseSchemaFields {
  title: string;
  slug: string;
  description?: string;
  content?: string; // Rich text HTML

  // Banner image
  bannerImage?: IServiceImage;

  // Services list (sub-services)
  servicesList: IServiceItem[];

  // Key activities
  keyActivities: IKeyActivity[];

  // Legacy features array (for backward compatibility)
  features: IServiceFeature[];

  // Legacy image
  image?: IServiceImage;

  // Metadata
  order: number;
}

/**
 * Image sub-schema (reusable)
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
};

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
      index: true,
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

    // Banner image
    bannerImage: imageSubSchema,

    // Services list (sub-services)
    servicesList: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: [200, 'Service item title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [2000, 'Service item description cannot exceed 2000 characters'],
        },
        image: imageSubSchema,
        link: {
          type: String,
          trim: true,
        },
        isExternal: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Key activities
    keyActivities: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: [200, 'Activity title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [1000, 'Activity description cannot exceed 1000 characters'],
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Legacy features array (for backward compatibility)
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

    // Legacy image
    image: imageSubSchema,

    // Metadata
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(serviceSchema);

// Add indexes for common queries
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ order: 1, createdAt: -1 });

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
