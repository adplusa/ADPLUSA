import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';

/**
 * Image with dark mode support
 */
export interface IFAQImage {
  url: string;
  darkModeUrl?: string;
}

/**
 * Individual FAQ item
 */
export interface IFAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ category interface
 */
export interface IFAQCategory {
  title: string;
  description?: string;
  chatLink?: string;
  image?: IFAQImage;
  faqs: IFAQItem[];
}

/**
 * FAQ document interface
 * Note: This is a singleton document (only one FAQ document should exist)
 */
export interface IFAQ extends Document, BaseSchemaFields {
  title: string;
  categories: IFAQCategory[];
}

/**
 * FAQ schema definition
 */
const faqSchema = new Schema<IFAQ>(
  {
    title: {
      type: String,
      required: [true, 'FAQ title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'Frequently Asked Questions',
    },
    categories: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, 'Category title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [1000, 'Category description cannot exceed 1000 characters'],
        },
        chatLink: {
          type: String,
          trim: true,
          match: [/^https?:\/\/.+/, 'Chat link must be a valid URL'],
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
        faqs: [
          {
            question: {
              type: String,
              required: true,
              trim: true,
              maxlength: [500, 'Question cannot exceed 500 characters'],
            },
            answer: {
              type: String,
              required: true,
              trim: true,
              maxlength: [2000, 'Answer cannot exceed 2000 characters'],
            },
          },
        ],
      },
    ],
  },
  baseSchemaOptions
);

// Add SEO fields
addSEOFields(faqSchema);

/**
 * FAQ model
 */
export const FAQ = model<IFAQ>('FAQ', faqSchema);
