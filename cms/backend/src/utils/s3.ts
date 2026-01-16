import AWS from "aws-sdk";
import { config } from "../config/env";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
});

export interface ImageUploadOptions {
    buffer: Buffer;
    originalName: string;
    folder: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

export interface ImageUploadResult {
    key: string;
    url: string;
    cloudFrontUrl?: string;
    cdnUrl: string; // The URL to use in frontend (CloudFront if available, otherwise S3)
    contentType: string;
    size: number;
    width: number;
    height: number;
}

export interface PresignedUploadUrl {
    uploadUrl: string;
    key: string;
    cdnUrl: string;
    expiresIn: number;
}

/**
 * Optimize image by resizing and compressing
 */
async function optimizeImage(
    buffer: Buffer,
    originalName: string, // Added originalName
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 85
): Promise<{ buffer: Buffer; width: number; height: number }> {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Skip optimization for ICO files or small images (like favicons)
    const format = metadata.format as string;
    const isIco =
        format === "ico" || originalName.toLowerCase().endsWith(".ico");

    if (
        isIco ||
        (metadata.width &&
            metadata.width < 128 &&
            metadata.height &&
            metadata.height < 128)
    ) {
        return {
            buffer,
            width: metadata.width || 0,
            height: metadata.height || 0,
        };
    }

    // Resize if image is larger than max dimensions
    let resized = image;
    if (metadata.width && metadata.height) {
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
            resized = image.resize(maxWidth, maxHeight, {
                fit: "inside",
                withoutEnlargement: true,
            });
        }
    }

    // Compress based on format
    let optimized;
    if (metadata.format === "png") {
        optimized = resized.png({ quality, compressionLevel: 9 });
    } else if (metadata.format === "webp") {
        optimized = resized.webp({ quality });
    } else if (metadata.format === "gif") {
        optimized = resized; // Keep GIF as is for simple upload or handle separately
    } else {
        // Default to JPEG
        optimized = resized.jpeg({ quality, mozjpeg: true });
    }

    const optimizedBuffer = await optimized.toBuffer();
    const optimizedMetadata = await sharp(optimizedBuffer).metadata();

    return {
        buffer: optimizedBuffer,
        width: optimizedMetadata.width || 0,
        height: optimizedMetadata.height || 0,
    };
}

/**
 * Upload image to S3 with optimization
 */
export async function uploadImageToS3(
    options: ImageUploadOptions
): Promise<ImageUploadResult> {
    const { buffer, originalName, folder, maxWidth, maxHeight, quality } =
        options;

    // Validate AWS configuration
    if (
        !config.aws.accessKeyId ||
        !config.aws.secretAccessKey ||
        !config.aws.bucketName
    ) {
        throw new Error(
            "AWS S3 configuration is incomplete. Please check environment variables."
        );
    }

    // Optimize image
    const {
        buffer: optimizedBuffer,
        width,
        height,
    } = await optimizeImage(buffer, originalName, maxWidth, maxHeight, quality);

    // Generate unique filename
    const fileExtension = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    // Determine content type
    const contentTypeMap: { [key: string]: string } = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        ico: "image/x-icon",
    };
    const contentType = contentTypeMap[fileExtension] || "image/jpeg";

    const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: config.aws.bucketName,
        Key: key,
        Body: optimizedBuffer,
        ContentType: contentType,
    };

    await s3.upload(uploadParams).promise();

    // Generate URLs
    const url = `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;

    // Ensure CloudFront URL has https:// prefix
    let cloudFrontUrl: string | undefined;
    if (config.aws.cloudFrontUrl) {
        const cfUrl = config.aws.cloudFrontUrl.startsWith("http")
            ? config.aws.cloudFrontUrl
            : `https://${config.aws.cloudFrontUrl}`;
        cloudFrontUrl = `${cfUrl}/${key}`;
    }

    // Use CloudFront URL if available, otherwise S3 URL
    const cdnUrl = cloudFrontUrl || url;

    return {
        key,
        url,
        cloudFrontUrl,
        cdnUrl,
        contentType,
        size: optimizedBuffer.length,
        width,
        height,
    };
}

/**
 * Upload multiple images to S3
 */
export async function uploadMultipleImagesToS3(
    images: Array<{ buffer: Buffer; originalName: string }>,
    folder: string
): Promise<ImageUploadResult[]> {
    const uploadPromises = images.map((image) =>
        uploadImageToS3({
            buffer: image.buffer,
            originalName: image.originalName,
            folder,
        })
    );

    return Promise.all(uploadPromises);
}

/**
 * Delete image from S3
 */
export async function deleteImageFromS3(key: string): Promise<void> {
    if (!config.aws.bucketName) {
        throw new Error("AWS S3 bucket name is not configured.");
    }

    const deleteParams: AWS.S3.DeleteObjectRequest = {
        Bucket: config.aws.bucketName,
        Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
}

/**
 * Delete multiple images from S3
 */
export async function deleteMultipleImagesFromS3(
    keys: string[]
): Promise<void> {
    if (!config.aws.bucketName) {
        throw new Error("AWS S3 bucket name is not configured.");
    }

    if (keys.length === 0) {
        return;
    }

    const deleteParams: AWS.S3.DeleteObjectsRequest = {
        Bucket: config.aws.bucketName,
        Delete: {
            Objects: keys.map((key) => ({ Key: key })),
            Quiet: false,
        },
    };

    await s3.deleteObjects(deleteParams).promise();
}

/**
 * Check if S3 is properly configured
 */
export function isS3Configured(): boolean {
    return !!(
        config.aws.accessKeyId &&
        config.aws.secretAccessKey &&
        config.aws.bucketName
    );
}

/**
 * Generate presigned URL for direct upload from client
 */
export async function generatePresignedUploadUrl(
    folder: string,
    fileName: string,
    contentType: string,
    expiresIn: number = 300 // 5 minutes default
): Promise<PresignedUploadUrl> {
    if (!config.aws.bucketName) {
        throw new Error("AWS S3 bucket name is not configured.");
    }

    // Generate unique filename
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    const uploadUrl = await s3.getSignedUrlPromise("putObject", {
        Bucket: config.aws.bucketName,
        Key: key,
        ContentType: contentType,
        Expires: expiresIn,
    });

    // Generate CDN URL for accessing the uploaded file
    let cdnUrl: string;
    if (config.aws.cloudFrontUrl) {
        const cfUrl = config.aws.cloudFrontUrl.startsWith("http")
            ? config.aws.cloudFrontUrl
            : `https://${config.aws.cloudFrontUrl}`;
        cdnUrl = `${cfUrl}/${key}`;
    } else {
        cdnUrl = `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
    }

    return {
        uploadUrl,
        key,
        cdnUrl,
        expiresIn,
    };
}

/**
 * Generate multiple presigned URLs for batch upload
 */
export async function generateMultiplePresignedUploadUrls(
    folder: string,
    files: Array<{ fileName: string; contentType: string }>,
    expiresIn: number = 300
): Promise<PresignedUploadUrl[]> {
    const presignedUrls = await Promise.all(
        files.map((file) =>
            generatePresignedUploadUrl(
                folder,
                file.fileName,
                file.contentType,
                expiresIn
            )
        )
    );

    return presignedUrls;
}

/**
 * Generate presigned URL for downloading/viewing a file
 */
export async function generatePresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600 // 1 hour default
): Promise<string> {
    if (!config.aws.bucketName) {
        throw new Error("AWS S3 bucket name is not configured.");
    }

    // If CloudFront is configured, return CloudFront URL (no presigning needed for public content)
    if (config.aws.cloudFrontUrl) {
        const cfUrl = config.aws.cloudFrontUrl.startsWith("http")
            ? config.aws.cloudFrontUrl
            : `https://${config.aws.cloudFrontUrl}`;
        return `${cfUrl}/${key}`;
    }

    // Otherwise, generate presigned S3 URL
    const downloadUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: config.aws.bucketName,
        Key: key,
        Expires: expiresIn,
    });

    return downloadUrl;
}

/**
 * Get CDN URL for a given S3 key
 */
export function getCdnUrl(key: string): string {
    if (config.aws.cloudFrontUrl) {
        const cfUrl = config.aws.cloudFrontUrl.startsWith("http")
            ? config.aws.cloudFrontUrl
            : `https://${config.aws.cloudFrontUrl}`;
        return `${cfUrl}/${key}`;
    }
    return `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
}

export { s3 };
