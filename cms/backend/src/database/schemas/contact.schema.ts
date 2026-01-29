import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Form field interface
 */
export interface IFormField {
  label: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'checkbox' | 'select';
  required: boolean;
  options?: string[];
}

/**
 * Why work with us item
 */
export interface IWhyWorkWithUsItem {
  icon?: string;
  title: string;
  description: string;
}

/**
 * Contact information interface
 */
export interface IContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  destinationEmail?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

/**
 * Image interface
 */
export interface IContactImage {
  url: string;
  alt?: string;
}

/**
 * Social Link interface
 */
export interface ISocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

/**
 * Contact page document interface
 * Note: This is a singleton document (only one Contact page document should exist)
 */
export interface IContact extends Document, BaseSchemaFields {
  // Main heading
  mainHeading?: string;

  // Form fields configuration
  formFields: IFormField[];

  // Contact image
  contactImage?: IContactImage;

  // Intro text (rich text)
  introText?: string;

  // Contact info
  contactInfo: IContactInfo;

  // Destination Email for form submissions
  destinationEmail?: string;

  // Google Map
  googleMapEmbedUrl?: string;

  // Why Work With Us section
  whyWorkWithUsHeading?: string;
  whyWorkWithUsItems: IWhyWorkWithUsItem[];

  // Right section image
  rightImage?: IContactImage;

  // Talk Ideas heading
  talkIdeasHeading?: string;

  // Social Links
  socialLinks?: ISocialLink[];

  // Service Options for Dropdown
  serviceOptions?: string[];

  // Legacy fields
  title: string;
  description?: string;
}

/**
 * Image sub-schema
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
 * Contact page schema definition
 */
const contactSchema = new Schema<IContact>(
  {
    // Main heading
    mainHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Main heading cannot exceed 200 characters'],
      default: 'Get in touch',
    },

    // Form fields configuration
    formFields: [
      {
        label: {
          type: String,
          trim: true,
          maxlength: [100, 'Label cannot exceed 100 characters'],
        },
        name: {
          type: String,
          trim: true,
          maxlength: [50, 'Field name cannot exceed 50 characters'],
        },
        type: {
          type: String,
          enum: ['text', 'email', 'phone', 'textarea', 'checkbox', 'select'],
          default: 'text',
        },
        required: {
          type: Boolean,
          default: true,
        },
        options: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    // Contact image
    contactImage: imageSubSchema,

    // Intro text (rich text)
    introText: {
      type: String,
      trim: true,
    },

    // Contact info
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
      destinationEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (v: string) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          message: 'Please provide a valid email address'
        }
      },
      socialMedia: {
        facebook: {
          type: String,
          trim: true,
        },
        twitter: {
          type: String,
          trim: true,
        },
        instagram: {
          type: String,
          trim: true,
        },
        linkedin: {
          type: String,
          trim: true,
        },
        youtube: {
          type: String,
          trim: true,
        },
      },
    },

    // Destination Email
    destinationEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Please provide a valid email address'
      }
    },

    // Google Map
    googleMapEmbedUrl: {
      type: String,
      trim: true,
    },

    // Why Work With Us section
    whyWorkWithUsHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Heading cannot exceed 200 characters'],
    },
    whyWorkWithUsItems: [
      {
        icon: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
          maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
      },
    ],

    // Right section image
    rightImage: imageSubSchema,

    // Talk Ideas heading
    talkIdeasHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Talk ideas heading cannot exceed 200 characters'],
      default: "Let's Talk Ideas",
    },

    // Social Links
    socialLinks: [
      {
        platform: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Service Options for Dropdown
    serviceOptions: [
      {
        type: String,
        trim: true,
      }
    ],

    // Legacy fields
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
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(contactSchema);

/**
 * Contact page model
 */
export const Contact = model<IContact>('Contact', contactSchema);
