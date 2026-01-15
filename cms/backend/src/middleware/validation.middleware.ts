import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";

/**
 * Validation schema interface
 */
interface ValidationRule {
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

interface ValidationSchema {
    [key: string]: ValidationRule;
}

/**
 * Generic validation middleware factory
 * Creates a middleware that validates request body against a schema
 */
export const validate = (schema: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const errors: { [key: string]: string } = {};
            const body = req.body;

            // Validate each field in the schema
            for (const [field, rules] of Object.entries(schema)) {
                const value = body[field];

                // Check required fields
                if (
                    rules.required &&
                    (value === undefined || value === null || value === "")
                ) {
                    errors[field] = rules.message || `${field} is required`;
                    continue;
                }

                // Skip validation if field is not required and not provided
                if (
                    !rules.required &&
                    (value === undefined || value === null)
                ) {
                    continue;
                }

                // Type validation
                if (rules.type) {
                    const actualType = Array.isArray(value)
                        ? "array"
                        : typeof value;
                    if (actualType !== rules.type) {
                        errors[field] =
                            rules.message ||
                            `${field} must be of type ${rules.type}`;
                        continue;
                    }
                }

                // String validations
                if (rules.type === "string" && typeof value === "string") {
                    if (rules.minLength && value.length < rules.minLength) {
                        errors[field] =
                            rules.message ||
                            `${field} must be at least ${rules.minLength} characters`;
                        continue;
                    }
                    if (rules.maxLength && value.length > rules.maxLength) {
                        errors[field] =
                            rules.message ||
                            `${field} cannot exceed ${rules.maxLength} characters`;
                        continue;
                    }
                    if (rules.pattern && !rules.pattern.test(value)) {
                        errors[field] =
                            rules.message || `${field} format is invalid`;
                        continue;
                    }
                }

                // Number validations
                if (rules.type === "number" && typeof value === "number") {
                    if (rules.min !== undefined && value < rules.min) {
                        errors[field] =
                            rules.message ||
                            `${field} must be at least ${rules.min}`;
                        continue;
                    }
                    if (rules.max !== undefined && value > rules.max) {
                        errors[field] =
                            rules.message ||
                            `${field} cannot exceed ${rules.max}`;
                        continue;
                    }
                }

                // Array validations
                if (rules.type === "array" && Array.isArray(value)) {
                    if (rules.minLength && value.length < rules.minLength) {
                        errors[field] =
                            rules.message ||
                            `${field} must have at least ${rules.minLength} items`;
                        continue;
                    }
                    if (rules.maxLength && value.length > rules.maxLength) {
                        errors[field] =
                            rules.message ||
                            `${field} cannot have more than ${rules.maxLength} items`;
                        continue;
                    }
                }

                // Custom validation
                if (rules.custom) {
                    const result = rules.custom(value);
                    if (result !== true) {
                        errors[field] =
                            typeof result === "string"
                                ? result
                                : rules.message || `${field} validation failed`;
                        continue;
                    }
                }
            }

            // If there are validation errors, throw AppError
            if (Object.keys(errors).length > 0) {
                throw new AppError(
                    "Validation failed",
                    400,
                    "VALIDATION_ERROR",
                    errors
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Validation schemas for different content types
 */

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
        pattern: /^[a-z0-9-]+$/,
        message:
            "Slug is required and can only contain lowercase letters, numbers, and hyphens",
    },
    description: {
        required: false,
        type: "string",
        maxLength: 2000,
        message: "Description cannot exceed 2000 characters",
    },
    images: {
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
        pattern: /^(\/|https?:\/\/).+/,
        message: "Link must be a valid URL (absolute or relative)",
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

// Project UPDATE validation schema (all fields optional for partial updates)
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
        pattern: /^[a-z0-9-]+$/,
        message:
            "Slug can only contain lowercase letters, numbers, and hyphens",
    },
    description: {
        required: false,
        type: "string",
        maxLength: 2000,
        message: "Description cannot exceed 2000 characters",
    },
    images: {
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
        pattern: /^(\/|https?:\/\/).+/,
        message: "Link must be a valid URL (absolute or relative)",
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
        pattern: /^[a-z0-9-]+$/,
        message:
            "Slug is required and can only contain lowercase letters, numbers, and hyphens",
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
    customHeadTags: {
        required: false,
        type: "string",
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
    customHeadTags: {
        required: false,
        type: "string",
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
    customHeadTags: {
        required: false,
        type: "string",
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

/**
 * Validation middleware for project creation/update
 */
export const validateProject = validate(projectValidationSchema);

/**
 * Validation middleware for project updates (allows partial data)
 */
export const validateProjectUpdate = validate(projectUpdateValidationSchema);

/**
 * Validation middleware for service creation/update
 */
export const validateService = validate(serviceValidationSchema);

/**
 * Validation middleware for FAQ update
 */
export const validateFAQ = validate(faqValidationSchema);

/**
 * Validation middleware for About page update
 */
export const validateAbout = validate(aboutValidationSchema);

/**
 * Validation middleware for Contact page update
 */
export const validateContact = validate(contactValidationSchema);

/**
 * Validation middleware for user registration
 */
export const validateUserRegistration = validate(userRegistrationSchema);

/**
 * Validation middleware for user login
 */
export const validateUserLogin = validate(userLoginSchema);
