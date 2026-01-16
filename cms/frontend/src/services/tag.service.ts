import { axiosApi } from './axios';

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}

export interface UpdateTagData extends Partial<CreateTagData> {}

export interface TagsResponse {
  success: boolean;
  data: Tag[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TagResponse {
  success: boolean;
  data: Tag;
}

// Get all tags
export const getTags = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<TagsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);

  const response = await axiosApi.get(`/admin/tags?${searchParams.toString()}`);
  return response.data;
};

// Get tag by ID
export const getTagById = async (id: string): Promise<TagResponse> => {
  const response = await axiosApi.get(`/admin/tags/${id}`);
  return response.data;
};

// Create tag
export const createTag = async (data: CreateTagData): Promise<TagResponse> => {
  const response = await axiosApi.post('/admin/tags', data);
  return response.data;
};

// Update tag
export const updateTag = async (id: string, data: UpdateTagData): Promise<TagResponse> => {
  const response = await axiosApi.put(`/admin/tags/${id}`, data);
  return response.data;
};

// Delete tag
export const deleteTag = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosApi.delete(`/admin/tags/${id}`);
  return response.data;
};