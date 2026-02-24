import type { AxiosProgressEvent } from "axios";
import { axiosApi } from "./axios";

export interface ImageMetadata {
    _id?: string;
    id?: string;
    key: string;
    bucket?: string;
    url: string;
    cloudFrontUrl?: string;
    cdnUrl?: string;
    contentType: string;
    size: number;
    etag?: string;
    width?: number;
    height?: number;
    createdAt?: string;
}

export interface ImageUploadResponse {
    success: boolean;
    data: ImageMetadata;
    message?: string;
}

export interface MultipleImageUploadResponse {
    success: boolean;
    data: ImageMetadata[];
    message?: string;
}

export interface ImagesListResponse {
    success: boolean;
    data: ImageMetadata[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ImageResponse {
    success: boolean;
    data: ImageMetadata;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}

export interface ImageQueryParams {
    page?: number;
    limit?: number;
}

/**
 * Upload single image using presigned URL
 */
export const uploadImage = async (
    file: File,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ImageUploadResponse> => {
    try {
        // Step 1: Get presigned URL from backend
        const presignedResponse = await axiosApi.post("/admin/presigned-upload", {
            fileName: file.name,
            contentType: file.type,
            folder: "images",
        });

        if (!presignedResponse.data?.data) {
            throw new Error("Failed to get presigned URL");
        }

        const { uploadUrl, key, cdnUrl } = presignedResponse.data.data;

        // Step 2: Upload file directly to S3 using presigned URL
        const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        });

        if (!uploadResponse.ok) {
            throw new Error(`S3 upload failed: ${uploadResponse.statusText}`);
        }

        // Step 3: Return image metadata
        return {
            success: true,
            data: {
                key,
                url: cdnUrl,
                cdnUrl,
                contentType: file.type,
                size: file.size,
            },
        };
    } catch (error: any) {
        throw error;
    }
};

/**
 * Upload multiple images using presigned URLs
 */
export const uploadMultipleImages = async (
    files: File[],
): Promise<MultipleImageUploadResponse> => {
    try {
        // Step 1: Get presigned URLs for all files
        const presignedResponse = await axiosApi.post("/admin/presigned-upload/batch", {
            files: files.map((f) => ({
                fileName: f.name,
                contentType: f.type,
            })),
            folder: "images",
        });

        if (!presignedResponse.data?.data) {
            throw new Error("Failed to get presigned URLs");
        }

        const presignedUrls = presignedResponse.data.data;

        // Step 2: Upload all files directly to S3 in parallel
        const uploadPromises = files.map((file, index) => {
            const { uploadUrl, key, cdnUrl } = presignedUrls[index];
            return fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`S3 upload failed for ${file.name}`);
                }
                return {
                    key,
                    url: cdnUrl,
                    cdnUrl,
                    contentType: file.type,
                    size: file.size,
                };
            });
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Step 3: Return image metadata
        return {
            success: true,
            data: uploadedImages,
        };
    } catch (error: any) {
        throw error;
    }
};

/**
 * List images with pagination
 */
export const listImages = async (
    params?: ImageQueryParams,
): Promise<ImagesListResponse> => {
    const response = await axiosApi.get<ImagesListResponse>("/admin/images", {
        params,
    });
    return response.data;
};

/**
 * Get image by ID
 */
export const getImageById = async (id: string): Promise<ImageResponse> => {
    const response = await axiosApi.get<ImageResponse>(`/admin/images/${id}`);
    return response.data;
};

/**
 * Delete image by ID
 */
export const deleteImage = async (id: string): Promise<DeleteResponse> => {
    const response = await axiosApi.delete<DeleteResponse>(
        `/admin/images/${id}`,
    );
    return response.data;
};

/**
 * Delete multiple images
 */
export const deleteMultipleImages = async (
    ids: string[],
): Promise<DeleteResponse> => {
    const response = await axiosApi.delete<DeleteResponse>("/admin/images", {
        data: { ids },
    });
    return response.data;
};
