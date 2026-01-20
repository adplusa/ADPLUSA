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
 * Upload single image
 */
export const uploadImage = async (
    file: File,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosApi.post<ImageUploadResponse>(
        "/admin/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        },
    );
    return response.data;
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (
    files: File[],
): Promise<MultipleImageUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("images", file);
    });

    const response = await axiosApi.post<MultipleImageUploadResponse>(
        "/admin/upload/multiple",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return response.data;
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
