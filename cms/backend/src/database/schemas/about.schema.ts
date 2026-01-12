import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Image with dark mode support
 */
export interface IAboutImage {
  url: string;
  darkModeUrl?: string;
}

/**
 * Anchor link for navigation
 */
export interface IAnchorLink {
  label: string;
  targetId: string;
}

/**
 * About page section
 */
export interface IAboutSection {
  sectionId: string;
  title: string;
  body: string;
  image?: IAboutImage;
}

/**
 * About page document interface
 * Note: This is a singleton document (only one About page document should exist)
 */
export interface IAbout extends Document, BaseSchemaFields {
  allowLightHeading?: string;
  allowUsHeading?: string;
  allowRightHeading?: string;
  paragraph?: string;
  anchorLinks: IAnchorLink[];
  sections: IAboutSection[];
}

/**
 * About page schema definition
 */
const aboutSchema = new Schema<IAbout>(
  {
    allowLightHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Heading cannot exceed 200 characters'],
    },
    allowUsHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Heading cannot exceed 200 characters'],
    },
    allowRightHeading: {
      type: String,
      trim: true,
      maxlength: [200, 'Heading cannot exceed 200 characters'],
    },
    paragraph: {
      type: String, // Rich text content stored as HTML
      trim: true,
    },
    anchorLinks: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
          maxlength: [100, 'Anchor link label cannot exceed 100 characters'],
        },
        targetId: {
          type: String,
          required: true,
          trim: true,
          // Allow any string for flexibility with Sanity data
        },
      },
    ],
    sections: [
      {
        sectionId: {
          type: String,
          required: true,
          trim: true,
          // Allow any string for flexibility with Sanity data
        },
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, 'Section title cannot exceed 200 characters'],
        },
        body: {
          type: String,
          required: true,
          trim: true,
        },
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
    ],
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(aboutSchema);

/**
 * About page model
 */
export const About = model<IAbout>('About', aboutSchema);
