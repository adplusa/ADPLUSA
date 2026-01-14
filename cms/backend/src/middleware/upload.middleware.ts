import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/x-icon",
    "image/vnd.microsoft.icon",
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * File filter to validate image types
 */
function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(
                    ", "
                )}`
            )
        );
    }
}

/**
 * Multer configuration for image uploads
 */
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter,
});

/**
 * Error handler for multer errors
 */
export function handleMulterError(
    error: any,
    req: Request,
    res: any,
    next: any
): void {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                error: {
                    code: "FILE_TOO_LARGE",
                    message: `File size exceeds the maximum limit of ${
                        MAX_FILE_SIZE / 1024 / 1024
                    }MB`,
                },
            });
        }

        return res.status(400).json({
            success: false,
            error: {
                code: "UPLOAD_ERROR",
                message: error.message,
            },
        });
    }

    if (error) {
        return res.status(400).json({
            success: false,
            error: {
                code: "UPLOAD_ERROR",
                message: error.message || "File upload failed",
            },
        });
    }

    next();
}
