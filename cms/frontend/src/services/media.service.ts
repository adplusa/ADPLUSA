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

export const mediaService = {
  getAll: () => ApiHelper.get("/api/admin/media"),
  getById: (id: string) => ApiHelper.get(`/api/admin/media/${id}`),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/media/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/media/${id}`),

  getPresignedUploadUrl: (fileName: string, contentType: string, folder: string = "uploads") =>
    ApiHelper.post("/api/admin/presigned-upload", { fileName, contentType, folder }),

  // Get presigned URLs for multiple files
  getPresignedUploadUrls: (files: Array<{ fileName: string; contentType: string }>, folder: string = "uploads") =>
    ApiHelper.post("/api/admin/presigned-upload/batch", { files, folder }),

  // Register media after presigned upload
  registerMedia: (data: MediaRegistration) =>
    ApiHelper.post("/api/admin/media", data),
};
