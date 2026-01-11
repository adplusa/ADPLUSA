import { axiosApi } from './axios';
import type { Tag } from './tag.service';

export interface MediaFile {
  _id: string;
  title: string;
  filename: string;
  originalName: string;
  s3Path: string;
  s3Url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  description?: string;
  tags: Tag[];
  uploadedBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaData {
  title: string;
  alt?: string;
  description?: string;
  tags?: string[];
}

export interface UpdateMediaData extends Partial<CreateMediaData> {}

export interface MediaResponse {
  success: boolean;
  data: MediaFile[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleMediaResponse {
  success: boolean;
  data: MediaFile;
}

// Get all media
export const getMedia = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  mimeType?: string;
  tags?: string[];
}): Promise<MediaResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.mimeType) searchParams.append('mimeType', params.mimeType);
  if (params?.tags) {
    params.tags.forEach(tag => searchParams.append('tags', tag));
  }

  const response = await axiosApi.get(`/admin/media?${searchParams.toString()}`);
  return response.data;
};

// Get media by ID
export const getMediaById = async (id: string): Promise<SingleMediaResponse> => {
  const response = await axiosApi.get(`/admin/media/${id}`);
  return response.data;
};

// Upload media
export const uploadMedia = async (
  file: File, 
  data: CreateMediaData
): Promise<SingleMediaResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', data.title);
  
  if (data.alt) formData.append('alt', data.alt);
  if (data.description) formData.append('description', data.description);
  if (data.tags) {
    data.tags.forEach(tag => formData.append('tags', tag));
  }

  const response = await axiosApi.post('/admin/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update media
export const updateMedia = async (
  id: string, 
  data: UpdateMediaData
): Promise<SingleMediaResponse> => {
  const response = await axiosApi.put(`/admin/media/${id}`, data);
  return response.data;
};

// Delete media
export const deleteMedia = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosApi.delete(`/admin/media/${id}`);
  return response.data;
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to check if file is image
export const isImage = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

// Helper function to get file type icon
export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  return '📁';
};