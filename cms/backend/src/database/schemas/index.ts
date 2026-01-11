/**
 * Central export for all database schemas
 */

// Export models
export { Project, IProject, IProjectImage } from './project.schema';
export { Service, IService, IServiceImage, IServiceFeature } from './service.schema';
export { FAQ, IFAQ, IFAQCategory, IFAQItem, IFAQImage } from './faq.schema';
export { About, IAbout, IAboutSection, IAnchorLink, IAboutImage } from './about.schema';
export { Contact, IContact, IContactInfo } from './contact.schema';
export { User, IUser, UserRole } from './user.schema';
export { Image, IImage } from './image.schema';

// Export base schema utilities
export { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';
