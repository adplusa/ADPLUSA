import { ApiHelper } from "./api-helper";

export interface Tag {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  slug?: string;
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

export const getTags = (params?: any) => ApiHelper.get<TagsResponse>("/admin/tags", { params });
export const getTagById = (id: string) => ApiHelper.get<Tag>(`/admin/tags/${id}`);
export const createTag = (data: any) => ApiHelper.post<Tag>("/admin/tags", data);
export const updateTag = (id: string, data: any) => ApiHelper.put<Tag>(`/admin/tags/${id}`, data);
export const deleteTag = (id: string) => ApiHelper.delete(`/admin/tags/${id}`);

export const tagService = {
  getAll: getTags,
  getById: getTagById,
  create: createTag,
  update: updateTag,
  delete: deleteTag,
};
