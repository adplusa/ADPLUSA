import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Common image interface
 */
export interface IHomepageImage {
  url: string;
  alt?: string;
}

/**
 * Hero slider slide
 */
export interface ISlide {
  image: IHomepageImage;
  order: number;
}

/**
 * Trust icon with number and name
 */
export interface ITrustIcon {
  image: IHomepageImage;
  number: string;
  name: string;
  order: number;
}

/**
 * Service box for homepage services section
 */
export interface IServiceBox {
  url: string;
  image: IHomepageImage;
  title: string;
  order: number;
}

/**
 * Technology image
 */
export interface ITechnologyImage {
  image: IHomepageImage;
  order: number;
}

/**
 * Process step
 */
export interface IProcessStep {
  title: string;
  description: string;
  image: IHomepageImage;
  order: number;
}

/**
 * Founder slide
 */
export interface IFounderSlide {
  title: string;
  description: string;
  descriptionTwo?: string;
  name: string;
  achievements?: string;
  partnerLabel?: string;
  partner?: string;
  image: IHomepageImage;
  order: number;
}

/**
 * Homepage document interface
 * Note: This is a singleton document (only one Homepage document should exist)
 */
export interface IHomepage extends Document, BaseSchemaFields {
  // Hero Slider
  sliderTitle?: string;
  slides: ISlide[];

  // Trust Icons Section
  trustIconsHeading?: string;
  trustIcons: ITrustIcon[];

  // Services Section
  serviceHeading?: string;
  serviceBoxes: IServiceBox[];
  serviceCta?: string;

  // Technology Section
  technologyHeading?: string;
  technologyImages: ITechnologyImage[];

  // Working Process Section
  workingProcessHeading?: string;
  workingProcessSubHeading?: string;
  processSteps: IProcessStep[];

  // Text Slider/Marquee
  sliderImage?: IHomepageImage;
  sliderTexts: string[];

  // About Section
  aboutLightHeading?: string;
  aboutUsHeading?: string;
  aboutRightHeading?: string;
  aboutParagraph?: string;
  aboutCtaButton?: string;
  aboutImages: IHomepageImage[];
  aboutVideo?: { url: string };
  peopleText?: string;
  founderSlides: IFounderSlide[];

  // Contact Section
  contactImage?: IHomepageImage;
  contactTitle?: string;
  contactButton?: string;
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
 * Homepage schema definition
 */
const homepageSchema = new Schema<IHomepage>(
  {
    // Hero Slider
    sliderTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Slider title cannot exceed 200 characters'],
    },
    slides: [
      {
        image: imageSubSchema,
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Trust Icons Section
    trustIconsHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Trust icons heading cannot exceed 200 characters'],
    },
    trustIcons: [
      {
        image: imageSubSchema,
        number: {
          type: String,
          trim: true,
        },
        name: {
          type: String,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Services Section
    serviceHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Service heading cannot exceed 200 characters'],
    },
    serviceBoxes: [
      {
        url: {
          type: String,
          trim: true,
        },
        image: imageSubSchema,
        title: {
          type: String,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    serviceCta: {
      type: String,
      trim: true,
      maxlength: [100, 'Service CTA cannot exceed 100 characters'],
    },

    // Technology Section
    technologyHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Technology heading cannot exceed 200 characters'],
    },
    technologyImages: [
      {
        image: imageSubSchema,
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Working Process Section
    workingProcessHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Working process heading cannot exceed 200 characters'],
    },
    workingProcessSubHeading: {
      type: String,
      trim: true,
      maxlength: [500, 'Working process sub-heading cannot exceed 500 characters'],
    },
    processSteps: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: [200, 'Process step title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [1000, 'Process step description cannot exceed 1000 characters'],
        },
        image: imageSubSchema,
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Text Slider/Marquee
    sliderImage: imageSubSchema,
    sliderTexts: [
      {
        type: String,
        trim: true,
      },
    ],

    // About Section
    aboutLightHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'About light heading cannot exceed 200 characters'],
    },
    aboutUsHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'About us heading cannot exceed 200 characters'],
    },
    aboutRightHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'About right heading cannot exceed 200 characters'],
    },
    aboutParagraph: {
      type: String, // Rich text content stored as HTML
      trim: true,
    },
    aboutCtaButton: {
      type: String,
      trim: true,
      maxlength: [100, 'About CTA button cannot exceed 100 characters'],
    },
    aboutImages: [imageSubSchema],
    aboutVideo: {
      url: {
        type: String,
        trim: true,
      },
    },
    peopleText: {
      type: String,
      trim: true,
      maxlength: [200, 'People text cannot exceed 200 characters'],
    },
    founderSlides: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: [200, 'Founder title cannot exceed 200 characters'],
        },
        description: {
          type: String, // Rich text content stored as HTML
          trim: true,
        },
        descriptionTwo: {
          type: String, // Rich text content stored as HTML
          trim: true,
        },
        name: {
          type: String,
          trim: true,
          maxlength: [100, 'Founder name cannot exceed 100 characters'],
        },
        achievements: {
          type: String,
          trim: true,
          maxlength: [500, 'Founder achievements cannot exceed 500 characters'],
        },
        partnerLabel: {
          type: String,
          trim: true,
          maxlength: [100, 'Partner label cannot exceed 100 characters'],
        },
        partner: {
          type: String,
          trim: true,
          maxlength: [200, 'Partner cannot exceed 200 characters'],
        },
        image: imageSubSchema,
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Contact Section
    contactImage: imageSubSchema,
    contactTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Contact title cannot exceed 200 characters'],
    },
    contactButton: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact button cannot exceed 100 characters'],
    },
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(homepageSchema);

/**
 * Homepage model
 */
export const Homepage = model<IHomepage>('Homepage', homepageSchema);
