export interface ValidationRule {
    required?: boolean;
    type?: "string" | "number" | "boolean" | "array" | "object";
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
    message?: string;
}

export interface ValidationSchema {
    [key: string]: ValidationRule;
}

// Project validation schema
export const projectValidationSchema: ValidationSchema = {
    title: {
        required: true,
        type: "string",
        minLength: 1,
        maxLength: 200,
        message: "Title is required and must be between 1 and 200 characters",
    },
    slug: {
        required: true,
        type: "string",
        pattern: /^[a-zA-Z0-9-]+$/,
        message:
            "Slug is required and can only contain letters, numbers, and hyphens",
    },
    description: {
        required: false,
        type: "string",
    },
    introText: {
        required: false,
        type: "string",
    },
    moreContent: {
        required: false,
        type: "string",
    },
    images: {
        required: false,
        type: "array",
    },
    projectDetails: {
        required: false,
        type: "array",
    },
    category: {
        required: false,
        type: "string",
    },
    featured: {
        required: false,
        type: "boolean",
    },
    link: {
        required: false,
        type: "string",
        pattern: /^(https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?|\/.*)$/,
        message: "Link must be a valid URL",
    },
    seoTitle: {
        required: false,
        type: "string",
        maxLength: 200,
    },
    seoDescription: {
        required: false,
        type: "string",
        maxLength: 500,
    },
    metaTags: {
        required: false,
        type: "array",
    },
};

export const projectUpdateValidationSchema: ValidationSchema = {
    title: {
        required: false,
        type: "string",
        minLength: 1,
        maxLength: 200,
        message: "Title must be between 1 and 200 characters",
    },
    slug: {
        required: false,
        type: "string",
        pattern: /^[a-zA-Z0-9-]+$/,
        message: "Slug can only contain letters, numbers, and hyphens",
    },
    description: {
        required: false,
        type: "string",
    },
    introText: {
        required: false,
        type: "string",
    },
    moreContent: {
        required: false,
        type: "string",
    },
    images: {
        required: false,
        type: "array",
    },
    projectDetails: {
        required: false,
        type: "array",
    },
    category: {
        required: false,
        type: "string",
    },
    featured: {
        required: false,
        type: "boolean",
    },
    link: {
        required: false,
        type: "string",
        pattern: /^(https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?|\/.*)$/,
        message: "Link must be a valid URL",
    },
    seoTitle: {
        required: false,
        type: "string",
        maxLength: 200,
    },
    seoDescription: {
        required: false,
        type: "string",
        maxLength: 500,
    },
    metaTags: {
        required: false,
        type: "array",
    },
};

// Service validation schema
export const serviceValidationSchema: ValidationSchema = {
    title: {
        required: true,
        type: "string",
        minLength: 1,
        maxLength: 200,
        message: "Title is required and must be between 1 and 200 characters",
    },
    slug: {
        required: true,
        type: "string",
        pattern: /^[a-zA-Z0-9-]+$/,
        message:
            "Slug is required and can only contain letters, numbers, and hyphens",
    },
    description: {
        required: false,
        type: "string",
        maxLength: 2000,
        message: "Description cannot exceed 2000 characters",
    },
    content: {
        required: false,
        type: "string",
    },
    bannerImage: {
        required: false,
        type: "object",
    },
    features: {
        required: false,
        type: "array",
    },
    image: {
        required: false,
        type: "object",
    },
    seoTitle: {
        required: false,
        type: "string",
        maxLength: 200,
    },
    seoDescription: {
        required: false,
        type: "string",
        maxLength: 500,
    },
    customHeadTags: {
        required: false,
        type: "string",
    },
};

// FAQ validation schema
export const faqValidationSchema: ValidationSchema = {
    title: {
        required: false,
        type: "string",
        maxLength: 200,
        message: "Title cannot exceed 200 characters",
    },
    categories: {
        required: false,
        type: "array",
    },
    seoTitle: {
        required: false,
        type: "string",
        maxLength: 200,
    },
    seoDescription: {
        required: false,
        type: "string",
        maxLength: 500,
    },
};

// About page validation schema
export const aboutValidationSchema: ValidationSchema = {
    allowLightHeading: {
        required: false,
        type: "string",
    },
    allowUsHeading: {
        required: false,
        type: "string",
    },
    allowRightHeading: {
        required: false,
        type: "string",
    },
    paragraph: {
        required: false,
        type: "string",
    },
    anchorLinks: {
        required: false,
        type: "array",
    },
    sections: {
        required: false,
        type: "array",
    },
    seoTitle: {
        required: false,
        type: "string",
        maxLength: 200,
    },
    seoDescription: {
        required: false,
        type: "string",
        maxLength: 500,
    },
};

// Contact page validation schema
export const contactValidationSchema: ValidationSchema = {
    title: {
        required: false,
        type: "string",
        maxLength: 200,
    },
    description: {
        required: false,
        type: "string",
    },
    contactInfo: {
        required: false,
        type: "object",
    },
    seoTitle: {
        required: false,
        type: "string",
        maxLength: 200,
    },
    seoDescription: {
        required: false,
        type: "string",
        maxLength: 500,
    },
};

// Tag validation schema
export const tagValidationSchema: ValidationSchema = {
    name: {
        required: true,
        type: "string",
        minLength: 1,
        maxLength: 50,
        message: "Name is required and must be between 1 and 50 characters",
    },
    slug: {
        required: true,
        type: "string",
        pattern: /^[a-zA-Z0-9-]+$/,
        message:
            "Slug is required and can only contain letters, numbers, and hyphens",
    },
    color: {
        required: true,
        type: "string",
        pattern: /^#([0-9a-fA-F]{3}){1,2}$/,
        message: "Color is required and must be a valid hex code",
    },
};

// User registration validation schema
export const userRegistrationSchema: ValidationSchema = {
    username: {
        required: true,
        type: "string",
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9_-]+$/,
        message:
            "Username is required and must be 3-50 characters (letters, numbers, underscore, hyphen only)",
    },
    email: {
        required: true,
        type: "string",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Valid email is required",
    },
    password: {
        required: true,
        type: "string",
        minLength: 8,
        message: "Password is required and must be at least 8 characters",
    },
    role: {
        required: false,
        type: "string",
        custom: (value) =>
            ["admin", "editor"].includes(value) ||
            "Role must be either admin or editor",
    },
};

// User login validation schema
export const userLoginSchema: ValidationSchema = {
    username: {
        required: true,
        type: "string",
        message: "Username is required",
    },
    password: {
        required: true,
        type: "string",
        message: "Password is required",
    },
};
