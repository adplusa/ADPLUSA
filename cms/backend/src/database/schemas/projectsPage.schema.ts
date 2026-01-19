import { Schema, model, Document } from 'mongoose';
import { BaseSchemaFields, baseSchemaOptions, addSEOFields, IMetaTag } from './base.schema';

/**
 * Projects Page document interface
 * Note: This is a singleton document (only one ProjectsPage document should exist)
 */
export interface IProjectsPage extends Document, BaseSchemaFields {
  // Page Content
  pageTitle?: string;
  pageSubtitle?: string;
  
  // Heading displayed on the page
  heading?: string;
  
  // SEO fields inherited from BaseSchemaFields via addSEOFields:
  // - seoTitle
  // - seoDescription
  // - customHeadTags (legacy)
  // - metaTags (structured meta tags array)
}

/**
 * Projects Page schema definition
 */
const projectsPageSchema = new Schema<IProjectsPage>(
  {
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
    heading: {
      type: String,
      trim: true,
      maxlength: [200, 'Heading cannot exceed 200 characters'],
    },
  },
  baseSchemaOptions
);

// Add SEO fields (seoTitle, seoDescription, customHeadTags, metaTags)
addSEOFields(projectsPageSchema);

/**
 * Projects Page model
 */
export const ProjectsPage = model<IProjectsPage>('ProjectsPage', projectsPageSchema);
