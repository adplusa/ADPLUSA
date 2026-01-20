import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    statusCode: number;
    code: string;
    details?: any;
    isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = "SERVER_ERROR",
        details?: any,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error response interface
 */
interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
        stack?: string;
    };
}

/**
 * Global error handler middleware
 * Handles all errors and returns consistent error responses
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // Default error values
    let statusCode = 500;
    let code = "SERVER_ERROR";
    let message = "An unexpected error occurred";
    let details: any = undefined;

    // Log error for debugging
    if (config.nodeEnv === "development") {
        console.error("Error occurred:", {
            name: err.name,
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            details: err instanceof AppError ? err.details : undefined,
        });
    } else {
        // In production, log less verbose error info
        console.error("Error:", err.message, "Path:", req.path);
    }

    // Handle custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
        details = err.details;
    }
    // Handle Mongoose validation errors
    else if (err.name === "ValidationError") {
        statusCode = 400;
        code = "VALIDATION_ERROR";
        message = "Validation failed";

        // Extract validation errors from Mongoose
        const validationErrors: any = {};
        if ("errors" in err) {
            const mongooseErr = err as any;
            Object.keys(mongooseErr.errors).forEach((key) => {
                validationErrors[key] = mongooseErr.errors[key].message;
            });
        }
        details = validationErrors;
    }
    // Handle Mongoose duplicate key errors
    else if (
        err.name === "MongoServerError" &&
        "code" in err &&
        (err as any).code === 11000
    ) {
        statusCode = 400;
        code = "DUPLICATE_ERROR";
        message = "Duplicate value error";

        // Extract the field that caused the duplicate error
        const keyValue = (err as any).keyValue;
        if (keyValue) {
            const field = Object.keys(keyValue)[0];
            message = `${field} already exists`;
            details = { field, value: keyValue[field] };
        }
    }
    // Handle Mongoose cast errors (invalid ObjectId, etc.)
    else if (err.name === "CastError") {
        statusCode = 400;
        code = "INVALID_ID";
        message = "Invalid ID format";
        details = { path: (err as any).path, value: (err as any).value };
    }
    // Handle JWT errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        code = "INVALID_TOKEN";
        message = "Invalid authentication token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        code = "TOKEN_EXPIRED";
        message = "Authentication token has expired";
    }
    // Handle multer file upload errors
    else if (err.name === "MulterError") {
        statusCode = 400;
        code = "UPLOAD_ERROR";

        const multerErr = err as any;
        if (multerErr.code === "LIMIT_FILE_SIZE") {
            message = "File size exceeds the maximum allowed limit";
        } else if (multerErr.code === "LIMIT_FILE_COUNT") {
            message = "Too many files uploaded";
        } else if (multerErr.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected file field";
        } else {
            message = "File upload error";
        }
        details = { code: multerErr.code };
    }
    // Handle generic errors
    else {
        // Keep default values for unknown errors
        message =
            config.nodeEnv === "development"
                ? err.message
                : "An unexpected error occurred";
    }

    // Build error response
    const errorResponse: ErrorResponse = {
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
            // Include stack trace only in development
            ...(config.nodeEnv === "development" && { stack: err.stack }),
        },
    };

    // Send error response
    res.status(statusCode).json(errorResponse);
};

/**
 * Not found handler middleware
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const error = new AppError(
        `Route ${req.method} ${req.path} not found`,
        404,
        "NOT_FOUND",
    );
    next(error);
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors and pass them to error middleware
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
