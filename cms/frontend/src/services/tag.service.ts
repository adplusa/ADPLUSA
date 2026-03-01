import { ApiHelper } from "./api-helper";

export interface Tag {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagsResponse {
  data: Tag[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const tagService = {
  getAll: () => ApiHelper.get("/api/admin/tags"),
  create: (data: any) => ApiHelper.post("/api/admin/tags", data),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/tags/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/tags/${id}`),
};

export async function getTags(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<TagsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", String(params.page));
  if (params.limit) queryParams.append("limit", String(params.limit));
  if (params.search) queryParams.append("search", params.search);

  const response = await ApiHelper.get<TagsResponse>(
    `/api/admin/tags?${queryParams.toString()}`
  );
  return response || { data: [] };
}

export async function createTag(data: any): Promise<any> {
  return ApiHelper.post("/api/admin/tags", data);
}

export async function updateTag(id: string, data: any): Promise<any> {
  return ApiHelper.put(`/api/admin/tags/${id}`, data);
}

export async function deleteTag(id: string): Promise<any> {
  return ApiHelper.delete(`/api/admin/tags/${id}`);
}

export async function getTagById(id: string): Promise<any> {
  return ApiHelper.get(`/api/admin/tags/${id}`);
}
