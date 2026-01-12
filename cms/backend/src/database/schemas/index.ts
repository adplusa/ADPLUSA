/**
 * Central export for all database schemas
 */

// Export models
export { Project, IProject, IProjectImage, IProjectDetail, IProjectImageGroup } from './project.schema';
export { Service, IService, IServiceImage, IServiceFeature, IServiceItem, IKeyActivity } from './service.schema';
export { FAQ, IFAQ, IFAQCategory, IFAQItem, IFAQImage } from './faq.schema';
export { About, IAbout, IAboutSection, IAnchorLink, IAboutImage } from './about.schema';
export { Contact, IContact, IContactInfo, IFormField, IWhyWorkWithUsItem, IContactImage } from './contact.schema';
export { User, IUser, UserRole } from './user.schema';
export { Image, IImage } from './image.schema';
export {
    Homepage,
    IHomepage,
    IHomepageImage,
    ISlide,
    ITrustIcon,
    IServiceBox,
    ITechnologyImage,
    IProcessStep,
    IFounderSlide
} from './homepage.schema';

// Export base schema utilities
export { BaseSchemaFields, baseSchemaOptions, addSEOFields } from './base.schema';
