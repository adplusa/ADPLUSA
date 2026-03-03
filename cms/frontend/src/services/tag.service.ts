import { ApiHelper } from "./api-helper";

export interface Tag {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

export const getTags = () => ApiHelper.get<Tag[]>("/admin/tags");

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
