import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Contact information interface
 */
export interface IContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

/**
 * Contact page document interface
 * Note: This is a singleton document (only one Contact page document should exist)
 */
export interface IContact extends Document, BaseSchemaFields {
  title: string;
  description?: string;
  contactInfo: IContactInfo;
}

/**
 * Contact page schema definition
 */
const contactSchema = new Schema<IContact>(
  {
    title: {
      type: String,
      required: [true, 'Contact page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'Contact Us',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    contactInfo: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters'],
      },
      socialMedia: {
        facebook: {
          type: String,
          trim: true,
          match: [/^https?:\/\/.+/, 'Facebook URL must be valid'],
        },
        twitter: {
          type: String,
          trim: true,
          match: [/^https?:\/\/.+/, 'Twitter URL must be valid'],
        },
        instagram: {
          type: String,
          trim: true,
          match: [/^https?:\/\/.+/, 'Instagram URL must be valid'],
        },
        linkedin: {
          type: String,
          trim: true,
          match: [/^https?:\/\/.+/, 'LinkedIn URL must be valid'],
        },
        youtube: {
          type: String,
          trim: true,
          match: [/^https?:\/\/.+/, 'YouTube URL must be valid'],
        },
      },
    },
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(contactSchema);

/**
 * Contact page model
 */
export const Contact = model<IContact>('Contact', contactSchema);
