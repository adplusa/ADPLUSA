import { Request, Response } from "express";
import { Service } from "../database/schemas/service.schema";
import { deleteImageFromS3, deleteMultipleImagesFromS3 } from "../utils/s3";
import { CacheService } from "../services/cache.service";

/**
 * @route   GET /api/services
 * @desc    Get all services
 * @access  Public
 */
export const getServices = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { search, sort = "-createdAt" } = req.query;

        // Build filter query
        const filter: any = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Execute query
        const services = await Service.find(filter)
            .sort(sort as string)
            .lean();

        res.status(200).json({
            success: true,
            data: services,
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to fetch services",
            },
        });
    }
};

/**
 * @route   GET /api/services/:slug
 * @desc    Get single service by slug
 * @access  Public
 */
export const getServiceBySlug = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { slug } = req.params;

        const service = await Service.findOne({ slug }).lean();

        if (!service) {
            res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: `Service with slug "${slug}" not found`,
                },
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        console.error("Error fetching service:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to fetch service",
            },
        });
    }
};

/**
 * @route   POST /api/admin/services
 * @desc    Create new service
 * @access  Protected (Admin)
 */
export const createService = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const {
            title,
            slug,
            description,
            content,
            bannerImage,
            features,
            image,
            seoTitle,
            seoDescription,
            servicesList,
            keyActivities,
            order,
            customHeadTags,
        } = req.body;

        // Validate required fields
        if (!title || !slug) {
            res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Title and slug are required",
                    details: {
                        title: !title ? "Title is required" : undefined,
                        slug: !slug ? "Slug is required" : undefined,
                    },
                },
            });
            return;
        }

        // Check if slug already exists
        const existingService = await Service.findOne({ slug });
        if (existingService) {
            res.status(400).json({
                success: false,
                error: {
                    code: "DUPLICATE_SLUG",
                    message: `Service with slug "${slug}" already exists`,
                },
            });
            return;
        }

        // Create new service
        const service = new Service({
            title,
            slug,
            description,
            content,
            bannerImage,
            servicesList: servicesList || [],
            keyActivities: keyActivities || [],
            features: features || [],
            image,
            order,
            seoTitle,
            seoDescription,
            customHeadTags,
        });

        await service.save();

        // Invalidate Cache
        await CacheService.invalidateService(slug);

        res.status(201).json({
            success: true,
            data: service,
            message: "Service created successfully",
        });
    } catch (error: any) {
        console.error("Error creating service:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            const validationErrors: any = {};
            Object.keys(error.errors).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
            });

            res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Validation failed",
                    details: validationErrors,
                },
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to create service",
            },
        });
    }
};

/**
 * @route   PUT /api/admin/services/:id
 * @desc    Update service
 * @access  Protected (Admin)
 */
export const updateService = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            title,
            slug,
            description,
            content,
            bannerImage,
            features,
            image,
            seoTitle,
            seoDescription,
            servicesList,
            keyActivities,
            order,
            customHeadTags,
        } = req.body;

        // Find service
        const service = await Service.findById(id);
        if (!service) {
            res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: `Service with ID "${id}" not found`,
                },
            });
            return;
        }

        // If slug is being changed, check for duplicates
        if (slug && slug !== service.slug) {
            const existingService = await Service.findOne({
                slug,
                _id: { $ne: id },
            });
            if (existingService) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "DUPLICATE_SLUG",
                        message: `Service with slug "${slug}" already exists`,
                    },
                });
                return;
            }
        }

        // Update fields
        const originalSlug = service.slug;

        if (title !== undefined) service.title = title;
        if (slug !== undefined) service.slug = slug;
        if (description !== undefined) service.description = description;
        if (content !== undefined) service.content = content;
        if (bannerImage !== undefined) service.bannerImage = bannerImage;
        if (servicesList !== undefined) service.servicesList = servicesList;
        if (keyActivities !== undefined) service.keyActivities = keyActivities;
        if (features !== undefined) service.features = features;
        if (image !== undefined) service.image = image;
        if (order !== undefined) service.order = order;
        if (seoTitle !== undefined) service.seoTitle = seoTitle;
        if (seoDescription !== undefined)
            service.seoDescription = seoDescription;
        if (customHeadTags !== undefined)
            service.customHeadTags = customHeadTags;

        await service.save();

        // Invalidate Cache
        await CacheService.invalidateService(service.slug);

        // If slug changed, invalidate the old slug as well
        if (originalSlug && originalSlug !== service.slug) {
            console.log(`🔥 Invalidating Old Service Slug: ${originalSlug}`);
            await CacheService.invalidateService(originalSlug);
        }

        res.status(200).json({
            success: true,
            data: service,
            message: "Service updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating service:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            const validationErrors: any = {};
            Object.keys(error.errors).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
            });

            res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Validation failed",
                    details: validationErrors,
                },
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to update service",
            },
        });
    }
};

/**
 * @route   DELETE /api/admin/services/:id
 * @desc    Delete service and associated images
 * @access  Protected (Admin)
 */
export const deleteService = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;

        // Find service
        const service = await Service.findById(id);
        if (!service) {
            res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: `Service with ID "${id}" not found`,
                },
            });
            return;
        }

        // Extract image keys from URLs for deletion
        const imageKeys: string[] = [];

        // Helper function to extract key from S3 URL
        const extractKeyFromUrl = (url: string | undefined) => {
            if (url) {
                const urlParts = url.split(".amazonaws.com/");
                if (urlParts.length > 1) {
                    imageKeys.push(urlParts[1]);
                }
            }
        };

        // Extract keys from banner image
        if (service.bannerImage) {
            extractKeyFromUrl(service.bannerImage.url);
        }

        // Extract keys from main image
        if (service.image) {
            extractKeyFromUrl(service.image.url);
        }

        // Delete service from database
        await Service.findByIdAndDelete(id);

        // Delete associated images from S3
        if (imageKeys.length > 0) {
            try {
                await deleteMultipleImagesFromS3(imageKeys);
            } catch (s3Error) {
                console.error("Error deleting images from S3:", s3Error);
                // Continue even if S3 deletion fails - service is already deleted
            }
        }

        // Invalidate Cache
        await CacheService.invalidateService(service.slug);

        res.status(200).json({
            success: true,
            message: "Service and associated images deleted successfully",
            data: {
                deletedService: service._id,
                deletedImages: imageKeys.length,
            },
        });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "Failed to delete service",
            },
        });
    }
};
