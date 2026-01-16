import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import {
    ValidationSchema,
    projectValidationSchema,
    projectUpdateValidationSchema,
    serviceValidationSchema,
    faqValidationSchema,
    aboutValidationSchema,
    contactValidationSchema,
    tagValidationSchema,
    userRegistrationSchema,
    userLoginSchema
} from './validation.schemas';


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
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors[field] = rules.message || `${field} is required`;
          continue;
        }

        // Skip validation if field is not required and not provided or empty
        if (!rules.required && (value === undefined || value === null || value === '')) {
          continue;
        }

        // Type validation
        if (rules.type) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          if (actualType !== rules.type) {
            errors[field] = rules.message || `${field} must be of type ${rules.type}`;
            continue;
          }
        }

        // String validations
        if (rules.type === 'string' && typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            errors[field] = rules.message || `${field} must be at least ${rules.minLength} characters`;
            continue;
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] = rules.message || `${field} cannot exceed ${rules.maxLength} characters`;
            continue;
          }
          if (rules.pattern && !rules.pattern.test(value)) {
            errors[field] = rules.message || `${field} format is invalid`;
            continue;
          }
        }

        // Number validations
        if (rules.type === 'number' && typeof value === 'number') {
          if (rules.min !== undefined && value < rules.min) {
            errors[field] = rules.message || `${field} must be at least ${rules.min}`;
            continue;
          }
          if (rules.max !== undefined && value > rules.max) {
            errors[field] = rules.message || `${field} cannot exceed ${rules.max}`;
            continue;
          }
        }

        // Array validations
        if (rules.type === 'array' && Array.isArray(value)) {
          if (rules.minLength && value.length < rules.minLength) {
            errors[field] = rules.message || `${field} must have at least ${rules.minLength} items`;
            continue;
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] = rules.message || `${field} cannot have more than ${rules.maxLength} items`;
            continue;
          }
        }

        // Custom validation
        if (rules.custom) {
          const result = rules.custom(value);
          if (result !== true) {
            errors[field] = typeof result === 'string' ? result : (rules.message || `${field} validation failed`);
            continue;
          }
        }
      }

      // If there are validation errors, throw AppError
      if (Object.keys(errors).length > 0) {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


/**
 * Validation middleware for project creation/update
 */
export const validateProject = validate(projectValidationSchema);

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
 * Validation middleware for tag creation/update
 */
export const validateTag = validate(tagValidationSchema);

/**
 * Validation middleware for user registration
 */
export const validateUserRegistration = validate(userRegistrationSchema);

/**
 * Validation middleware for user login
 */
export const validateUserLogin = validate(userLoginSchema);
