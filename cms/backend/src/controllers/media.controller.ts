import { Request, Response } from "express";
import { Media } from "../database/schemas/media.schema";
import { deleteImageFromS3, getCdnUrl } from "../utils/s3";
import { ApiResponse } from "../types/api.types";

// Get all media
export const getMedia = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, search, mimeType, tags } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        let query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { alt: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (mimeType) {
            if (mimeType === "image") {
                query.mimeType = { $regex: "^image/", $options: "i" };
            } else {
                query.mimeType = { $regex: mimeType, $options: "i" };
            }
        }

        if (tags) {
            const tagIds = Array.isArray(tags) ? tags : [tags];
            query.tags = { $in: tagIds };
        }

        const [mediaDocs, total] = await Promise.all([
            Media.find(query)
                .populate("tags", "name color")
                .populate("uploadedBy", "username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Media.countDocuments(query),
        ]);

        // Convert to objects and generate CDN URLs
        const media = mediaDocs.map((doc) => {
            const docObj = doc.toObject();
            if (docObj.s3Path) {
                docObj.s3Url = getCdnUrl(docObj.s3Path);
            }
            return docObj;
        });

        const response = {
            success: true,
            data: {
                data: media,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum),
                },
            },
        };

        res.json(response);
    } catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch media" },
        });
    }
};

// Get media by ID
export const getMediaById = async (req: Request, res: Response) => {
    try {
        const mediaDoc = await Media.findById(req.params.id)
            .populate("tags", "name color")
            .populate("uploadedBy", "username");

        if (!mediaDoc) {
            return res.status(404).json({
                success: false,
                error: { message: "Media not found" },
            });
        }

        const media = mediaDoc.toObject();
        if (media.s3Path) {
            media.s3Url = getCdnUrl(media.s3Path);
        }

        res.json({
            success: true,
            data: media,
        });
    } catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch media" },
        });
    }
};

// Register media after presigned upload
export const registerMedia = async (req: Request, res: Response) => {
    try {
        const { title, alt, description, tags, s3Path, mimeType, size, width, height } = req.body;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: { message: "User not authenticated" },
            });
        }

        const userId =
            (req.user as any)._id ||
            (req.user as any).id ||
            (req.user as any).userId ||
            (req.user as any).sub;

        if (!userId) {
            return res.status(500).json({
                success: false,
                error: { message: "User ID could not be determined" },
            });
        }

        if (!title || !s3Path || !mimeType) {
            return res.status(400).json({
                success: false,
                error: { message: "title, s3Path, and mimeType are required" },
            });
        }

        const filename = s3Path.split("/").pop() || s3Path;
        // Create media record
        const media = new Media({
            title,
            filename,
            originalName: filename,
            s3Path,
            s3Url: getCdnUrl(s3Path),
            mimeType,
            size: size || 0,
            width,
            height,
            alt,
            description,
            tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
            uploadedBy: userId,
        });

        await media.save();
        await media.populate("tags", "name color");
        await media.populate("uploadedBy", "username");

        const mediaObj = media.toObject();
        mediaObj.s3Url = getCdnUrl(mediaObj.s3Path);

        res.status(201).json({
            success: true,
            data: mediaObj,
        });
    } catch (error) {
        console.error("Error registering media:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to register media" },
        });
    }
};

// Update media
export const updateMedia = async (req: Request, res: Response) => {
    try {
        const { title, alt, description, tags } = req.body;

        const mediaDoc = await Media.findByIdAndUpdate(
            req.params.id,
            {
                title,
                alt,
                description,
                tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
            },
            { new: true, runValidators: true },
        )
            .populate("tags", "name color")
            .populate("uploadedBy", "username");

        if (!mediaDoc) {
            return res.status(404).json({
                success: false,
                error: { message: "Media not found" },
            });
        }

        const media = mediaDoc.toObject();
        if (media.s3Path) {
            media.s3Url = getCdnUrl(media.s3Path);
        }

        res.json({
            success: true,
            data: media,
        });
    } catch (error) {
        console.error("Error updating media:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to update media" },
        });
    }
};

// Delete media
export const deleteMedia = async (req: Request, res: Response) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({
                success: false,
                error: { message: "Media not found" },
            });
        }

        // Delete from S3
        try {
            await deleteImageFromS3(media.s3Path);
        } catch (error) {
            console.error("Error deleting from S3:", error);
        }

        // Delete from database
        await Media.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Media deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting media:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to delete media" },
        });
    }
};
