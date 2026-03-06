import { ApiHelper } from "./api-helper";

export interface PresignedUploadUrl {
  uploadUrl: string;
  key: string;
  cdnUrl: string;
  expiresIn: number;
}

export interface MediaRegistration {
  title: string;
  alt?: string;
  description?: string;
  tags?: string[];
  s3Path: string;
  mimeType: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface MediaFile {
  _id: string;
  title: string;
  filename: string;
  s3Path: string;
  s3Url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  description?: string;
  tags: Array<{ _id: string; name: string; color: string }> | any[];
  uploadedBy?: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  data: MediaFile[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UpdateMediaData {
  title: string;
  alt?: string;
  description?: string;
  tags?: string[];
}

export const getMedia = (params?: any) => ApiHelper.get<MediaListResponse>("/admin/media", { params });
export const getMediaById = (id: string) => ApiHelper.get<MediaFile>(`/admin/media/${id}`);
export const updateMedia = (id: string, data: any) => ApiHelper.put<MediaFile>(`/admin/media/${id}`, data);
export const deleteMedia = (id: string) => ApiHelper.delete(`/admin/media/${id}`);

export const getPresignedUploadUrl = (fileName: string, contentType: string, folder: string = "uploads") =>
  ApiHelper.post<PresignedUploadUrl>("/admin/presigned-upload", { fileName, contentType, folder });

export const getPresignedUploadUrls = (files: Array<{ fileName: string; contentType: string }>, folder: string = "uploads") =>
  ApiHelper.post<PresignedUploadUrl[]>("/admin/presigned-upload/batch", { files, folder });

export const registerMedia = (data: MediaRegistration) =>
  ApiHelper.post("/admin/media", data);

export const isImage = (mimeType: string): boolean => {
  return mimeType.startsWith("image/");
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  return "📎";
};

export const mediaService = {
  getAll: getMedia,
  getById: getMediaById,
  update: updateMedia,
  delete: deleteMedia,
  getPresignedUploadUrl,
  getPresignedUploadUrls,
  registerMedia,
  isImage,
  formatFileSize,
  getFileTypeIcon,
};
