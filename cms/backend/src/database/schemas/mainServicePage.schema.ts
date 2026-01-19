import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Image interface for main service page
 */
export interface IMainServicePageImage {
  url: string;
  alt?: string;
}

/**
 * Why Work With Us item interface
 */
export interface IWhyWorkWithUsItem {
  icon?: string;
  title: string;
  description: string;
}

/**
 * Main Service Page document interface
 * Note: This is a singleton document (only one MainServicePage document should exist)
 */
export interface IMainServicePage extends Document, BaseSchemaFields {
  // Banner
  bannerImage?: IMainServicePageImage;
  bannerTitle?: string;

  // Page Content
  pageTitle?: string;
  pageSubtitle?: string;

  // Trust Icons Section
  showTrustIcons: boolean;
  trustIconsHeading?: string;

  // Services Section
  servicesHeading?: string;

  // Why Work With Us Section
  showWhyWorkWithUs: boolean;
  whyWorkWithUsHeading?: string;
  whyWorkWithUsItems: IWhyWorkWithUsItem[];
  whyWorkWithUsImage?: IMainServicePageImage;

  // Contact Form Section
  showContactForm: boolean;
  contactFormHeading?: string;
  contactFormSubheading?: string;
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
 * Why Work With Us item sub-schema
 */
const whyWorkWithUsItemSchema = {
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
};

/**
 * Main Service Page schema definition
 */
const mainServicePageSchema = new Schema<IMainServicePage>(
  {
    // Banner
    bannerImage: imageSubSchema,
    bannerTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Banner title cannot exceed 200 characters'],
    },

    // Page Content
    pageTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Page title cannot exceed 200 characters'],
    },
    pageSubtitle: {
      type: String,
      trim: true,
      maxlength: [500, 'Page subtitle cannot exceed 500 characters'],
    },

    // Trust Icons Section
    showTrustIcons: {
      type: Boolean,
      default: true,
    },
    trustIconsHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Trust icons heading cannot exceed 200 characters'],
    },

    // Services Section
    servicesHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Services heading cannot exceed 200 characters'],
    },

    // Why Work With Us Section
    showWhyWorkWithUs: {
      type: Boolean,
      default: true,
    },
    whyWorkWithUsHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Why work with us heading cannot exceed 200 characters'],
    },
    whyWorkWithUsItems: [whyWorkWithUsItemSchema],
    whyWorkWithUsImage: imageSubSchema,

    // Contact Form Section
    showContactForm: {
      type: Boolean,
      default: true,
    },
    contactFormHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Contact form heading cannot exceed 200 characters'],
    },
    contactFormSubheading: {
      type: String,
      trim: true,
      maxlength: [500, 'Contact form subheading cannot exceed 500 characters'],
    },
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(mainServicePageSchema);

/**
 * Main Service Page model
 */
export const MainServicePage = model<IMainServicePage>('MainServicePage', mainServicePageSchema);
