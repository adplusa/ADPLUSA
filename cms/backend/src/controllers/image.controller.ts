import { Request, Response } from "express";
import { Image } from "../database/schemas";
import {
    uploadImageToS3,
    uploadMultipleImagesToS3,
    deleteImageFromS3,
    isS3Configured,
} from "../utils/s3";

/**
 * Upload single image
 */
export async function uploadSingleImage(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        // Check if S3 is configured
        if (!isS3Configured()) {
            res.status(503).json({
                success: false,
                error: {
                    code: "S3_NOT_CONFIGURED",
                    message:
                        "AWS S3 is not properly configured. Please check environment variables.",
                },
            });
            return;
        }

        // Check if file exists
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: {
                    code: "NO_FILE",
                    message: "No file uploaded",
                },
            });
            return;
        }

        // Get folder from request body (default to 'general')
        const folder = req.body.folder || "general";

        // Upload to S3
        const uploadResult = await uploadImageToS3({
            buffer: req.file.buffer,
            originalName: req.file.originalname,
            contentType: req.file.mimetype,
            folder,
        });

        // Save metadata to MongoDB
        const image = new Image({
            key: uploadResult.key,
            url: uploadResult.url,
            cloudFrontUrl: uploadResult.cloudFrontUrl,
            cdnUrl: uploadResult.cdnUrl,
            contentType: uploadResult.contentType,
            size: uploadResult.size,
            width: uploadResult.width,
            height: uploadResult.height,
            folder,
            originalName: req.file.originalname,
        });

        await image.save();

        res.status(201).json({
            success: true,
            data: {
                id: image._id,
                key: image.key,
                url: image.url,
                cloudFrontUrl: image.cloudFrontUrl,
                cdnUrl: image.cdnUrl,
                width: image.width,
                height: image.height,
                size: image.size,
                contentType: image.contentType,
            },
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "UPLOAD_FAILED",
                message: "Failed to upload image",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
        });
    }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        // Check if S3 is configured
        if (!isS3Configured()) {
            res.status(503).json({
                success: false,
                error: {
                    code: "S3_NOT_CONFIGURED",
                    message:
                        "AWS S3 is not properly configured. Please check environment variables.",
                },
            });
            return;
        }

        // Check if files exist
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({
                success: false,
                error: {
                    code: "NO_FILES",
                    message: "No files uploaded",
                },
            });
            return;
        }

        // Get folder from request body (default to 'general')
        const folder = req.body.folder || "general";

        // Prepare files for upload
        const filesToUpload = req.files.map((file) => ({
            buffer: file.buffer,
            originalName: file.originalname,
        }));

        // Upload to S3
        const uploadResults = await Promise.all(
            req.files.map((file) =>
                uploadImageToS3({
                    buffer: file.buffer,
                    originalName: file.originalname,
                    contentType: file.mimetype,
                    folder,
                }),
            ),
        );

        // Save metadata to MongoDB
        const imageDocuments = uploadResults.map((result, index) => {
            const files = req.files as Express.Multer.File[];
            return {
                key: result.key,
                url: result.url,
                cloudFrontUrl: result.cloudFrontUrl,
                cdnUrl: result.cdnUrl,
                contentType: result.contentType,
                size: result.size,
                width: result.width,
                height: result.height,
                folder,
                originalName: files[index].originalname,
            };
        });

        const savedImages = await Image.insertMany(imageDocuments);

        res.status(201).json({
            success: true,
            data: savedImages.map((image) => ({
                id: image._id,
                key: image.key,
                url: image.url,
                cloudFrontUrl: image.cloudFrontUrl,
                cdnUrl: image.cdnUrl,
                width: image.width,
                height: image.height,
                size: image.size,
                contentType: image.contentType,
            })),
        });
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "UPLOAD_FAILED",
                message: "Failed to upload images",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
        });
    }
}

/**
 * Get image by ID
 */
export async function getImageById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const image = await Image.findById(id);

        if (!image) {
            res.status(404).json({
                success: false,
                error: {
                    code: "IMAGE_NOT_FOUND",
                    message: "Image not found",
                },
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                id: image._id,
                key: image.key,
                url: image.url,
                cloudFrontUrl: image.cloudFrontUrl,
                cdnUrl: image.cdnUrl,
                width: image.width,
                height: image.height,
                size: image.size,
                contentType: image.contentType,
                folder: image.folder,
                originalName: image.originalName,
                createdAt: image.createdAt,
            },
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "FETCH_FAILED",
                message: "Failed to fetch image",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
        });
    }
}

/**
 * List images with pagination and filtering
 */
export async function listImages(req: Request, res: Response): Promise<void> {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const folder = req.query.folder as string;

        const query: any = {};
        if (folder) {
            query.folder = folder;
        }

        const skip = (page - 1) * limit;

        const [images, total] = await Promise.all([
            Image.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Image.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: images.map((image) => ({
                id: image._id,
                key: image.key,
                url: image.url,
                cloudFrontUrl: image.cloudFrontUrl,
                cdnUrl: image.cdnUrl,
                width: image.width,
                height: image.height,
                size: image.size,
                contentType: image.contentType,
                folder: image.folder,
                originalName: image.originalName,
                createdAt: image.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error listing images:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "LIST_FAILED",
                message: "Failed to list images",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
        });
    }
}

/**
 * Delete image by ID
 */
export async function deleteImage(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        // Find image in database
        const image = await Image.findById(id);

        if (!image) {
            res.status(404).json({
                success: false,
                error: {
                    code: "IMAGE_NOT_FOUND",
                    message: "Image not found",
                },
            });
            return;
        }

        // Delete from S3
        try {
            await deleteImageFromS3(image.key);
        } catch (s3Error) {
            console.error("Error deleting from S3:", s3Error);
            // Continue with database deletion even if S3 deletion fails
            // This prevents orphaned database records
        }

        // Delete from database
        await Image.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "DELETE_FAILED",
                message: "Failed to delete image",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
        });
    }
}

/**
 * Delete multiple images by IDs
 */
export async function deleteMultipleImages(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_INPUT",
                    message: "Please provide an array of image IDs",
                },
            });
            return;
        }

        // Find images in database
        const images = await Image.find({ _id: { $in: ids } });

        if (images.length === 0) {
            res.status(404).json({
                success: false,
                error: {
                    code: "IMAGES_NOT_FOUND",
                    message: "No images found with the provided IDs",
                },
            });
            return;
        }

        // Delete from S3
        const keys = images.map((image) => image.key);
        try {
            await deleteImageFromS3(keys[0]); // Delete first one
            // For multiple, we could use deleteMultipleImagesFromS3 but let's do it one by one for safety
            for (let i = 1; i < keys.length; i++) {
                await deleteImageFromS3(keys[i]);
            }
        } catch (s3Error) {
            console.error("Error deleting from S3:", s3Error);
            // Continue with database deletion even if S3 deletion fails
        }

        // Delete from database
        const result = await Image.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} image(s) deleted successfully`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Error deleting images:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "DELETE_FAILED",
                message: "Failed to delete images",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
        });
    }
}
