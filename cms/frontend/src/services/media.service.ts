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
  tags: Array<{ _id: string; name: string; color: string }>;
  uploadedBy: { _id: string; username: string };
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

export const mediaService = {
  getAll: () => ApiHelper.get("/api/admin/media"),
  getById: (id: string) => ApiHelper.get(`/api/admin/media/${id}`),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/media/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/media/${id}`),

  getPresignedUploadUrl: (fileName: string, contentType: string, folder: string = "uploads") =>
    ApiHelper.post("/api/admin/presigned-upload", { fileName, contentType, folder }),

  getPresignedUploadUrls: (files: Array<{ fileName: string; contentType: string }>, folder: string = "uploads") =>
    ApiHelper.post("/api/admin/presigned-upload/batch", { files, folder }),

  registerMedia: (data: MediaRegistration) =>
    ApiHelper.post("/api/admin/media", data),
};

// Helper functions for MediaLibrary
export async function getMedia(params: {
  page?: number;
  limit?: number;
  search?: string;
  mimeType?: string;
  tags?: string[];
}): Promise<MediaListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", String(params.page));
  if (params.limit) queryParams.append("limit", String(params.limit));
  if (params.search) queryParams.append("search", params.search);
  if (params.mimeType) queryParams.append("mimeType", params.mimeType);
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach(tag => queryParams.append("tags", tag));
  }

  const response = await ApiHelper.get<MediaListResponse>(
    `/api/admin/media?${queryParams.toString()}`
  );
  return response || { data: [] };
}

export async function deleteMedia(id: string): Promise<any> {
  return ApiHelper.delete(`/api/admin/media/${id}`);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  return "📎";
}
