/**
 * CMS Types - TypeScript interfaces matching backend schemas
 * These types are used by the CMS client to provide type safety
 */

// ============================================================================
// Common Types
// ============================================================================

/**
 * Base fields present on all CMS documents
 */
export interface BaseFields {
    _id: string;
    createdAt: string;
    updatedAt: string;
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
}

/**
 * Common image interface
 */
export interface CMSImage {
    url: string;
    alt?: string;
}

/**
 * Image with dimensions
 */
export interface CMSImageWithDimensions extends CMSImage {
    width?: number;
    height?: number;
}

/**
 * Image with dark mode support
 */
export interface CMSImageWithDarkMode {
    url: string;
    darkModeUrl?: string;
}

// ============================================================================
// Homepage Types
// ============================================================================

export interface HomepageSlide {
    image: CMSImage;
    order: number;
}

export interface TrustIcon {
    image: CMSImage;
    number: string;
    name: string;
    order: number;
}

export interface ServiceBox {
    url: string;
    image: CMSImage;
    title: string;
    order: number;
}

export interface TechnologyImage {
    image: CMSImage;
    order: number;
}

export interface ProcessStep {
    title: string;
    description: string;
    image: CMSImage;
    order: number;
}

export interface FounderSlide {
    title: string;
    description: string;
    descriptionTwo?: string;
    name: string;
    achievements?: string;
    partnerLabel?: string;
    partner?: string;
    image: CMSImage;
    order: number;
}

export interface Homepage extends BaseFields {
    // Hero Slider
    sliderTitle?: string;
    slides: HomepageSlide[];

    // Trust Icons Section
    trustIconsHeading?: string;
    trustIcons: TrustIcon[];

    // Services Section
    serviceHeading?: string;
    serviceBoxes: ServiceBox[];
    serviceCta?: string;

    // Technology Section
    technologyHeading?: string;
    technologyImages: TechnologyImage[];

    // Working Process Section
    workingProcessHeading?: string;
    workingProcessSubHeading?: string;
    processSteps: ProcessStep[];

    // Text Slider/Marquee
    sliderImage?: CMSImage;
    sliderTexts: string[];

    // About Section
    aboutLightHeading?: string;
    aboutUsHeading?: string;
    aboutRightHeading?: string;
    aboutParagraph?: string;
    aboutCtaButton?: string;
    aboutImages: CMSImage[];
    aboutVideo?: { url: string };
    peopleText?: string;
    founderSlides: FounderSlide[];

    // Contact Section
    contactImage?: CMSImage;
    contactTitle?: string;
    contactButton?: string;
}

// ============================================================================
// Project Types
// ============================================================================

export interface ProjectDetail {
    label: string;
    value?: string;
    items?: string[];
}

export interface ProjectImageGroup {
    topImages: CMSImageWithDimensions[];
    bottomImage?: CMSImageWithDimensions;
}

export interface Project extends BaseFields {
    title: string;
    slug: string;
    description?: string;

    // Main/Hero image
    mainImage?: CMSImageWithDimensions;

    // Content
    introText?: string;
    moreContent?: string; // Rich text HTML

    // Project details (label-value pairs)
    projectDetails: ProjectDetail[];

    // Image galleries
    imageGalleries: ProjectImageGroup[];

    // Legacy images array
    images: CMSImageWithDimensions[];

    // Metadata
    category?: string;
    featured: boolean;
    order: number;
    link?: string;
}

// ============================================================================
// Service Types
// ============================================================================

export interface ServiceItem {
    title: string;
    description: string;
    image?: CMSImage;
    link?: string;
    isExternal: boolean;
    order: number;
}

export interface KeyActivity {
    title: string;
    description: string;
    order: number;
}

export interface ServiceFeature {
    title: string;
    description: string;
}

export interface Service extends BaseFields {
    title: string;
    slug: string;
    description?: string;
    content?: string; // Rich text HTML

    // Banner image
    bannerImage?: CMSImage;

    // Services list (sub-services)
    servicesList: ServiceItem[];

    // Key activities
    keyActivities: KeyActivity[];

    // Legacy features array
    features: ServiceFeature[];

    // Legacy image
    image?: CMSImage;

    // Metadata
    order: number;
}

// ============================================================================
// About Page Types
// ============================================================================

export interface AnchorLink {
    label: string;
    targetId: string;
}

export interface AboutSection {
    sectionId: string;
    title: string;
    body: string;
    image?: CMSImageWithDarkMode;
}

export interface About extends BaseFields {
    allowLightHeading?: string;
    allowUsHeading?: string;
    allowRightHeading?: string;
    paragraph?: string;
    anchorLinks: AnchorLink[];
    sections: AboutSection[];
}

// ============================================================================
// Contact Page Types
// ============================================================================

export interface FormField {
    label: string;
    name: string;
    type: "text" | "email" | "phone" | "textarea" | "checkbox";
    required: boolean;
}

export interface WhyWorkWithUsItem {
    icon?: string;
    title: string;
    description: string;
}

export interface SocialMedia {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
}

export interface ContactInfo {
    email?: string;
    phone?: string;
    address?: string;
    socialMedia?: SocialMedia;
}

export interface Contact extends BaseFields {
    // Main heading
    mainHeading?: string;

    // Form fields configuration
    formFields: FormField[];

    // Contact image
    contactImage?: CMSImage;

    // Intro text (rich text)
    introText?: string;

    // Contact info
    contactInfo: ContactInfo;

    // Google Map
    googleMapEmbedUrl?: string;

    // Why Work With Us section
    whyWorkWithUsHeading?: string;
    whyWorkWithUsItems: WhyWorkWithUsItem[];

    // Right section image
    rightImage?: CMSImage;

    // Talk Ideas heading
    talkIdeasHeading?: string;

    // Legacy fields
    title: string;
    description?: string;
}

// ============================================================================
// FAQ Types
// ============================================================================

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQCategory {
    title: string;
    description?: string;
    chatLink?: string;
    image?: CMSImageWithDarkMode;
    faqs: FAQItem[];
}

export interface FAQ extends BaseFields {
    title: string;
    categories: FAQCategory[];
}

// ============================================================================
// General Settings Types (Singleton)
// ============================================================================

/**
 * General Settings for site-wide configuration
 */
export interface GeneralSettings {
    _id: string;
    headerLogo?: CMSImage;
    footerLogo?: CMSImage;
    favicon?: CMSImage;
    siteName?: string;
    siteDescription?: string;
    customHeadTags?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface CMSResponse<T> {
    success: boolean;
    data: T | null;
    error?: string;
}

export interface CMSListResponse<T> {
    success: boolean;
    data: T[];
    error?: string;
}
