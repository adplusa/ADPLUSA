import { axiosApi } from './axios';

export interface ProjectImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ProjectDetail {
  label: string;
  value: string;
  items?: string[];
}

export interface ImageGallery {
  title: string;
  images: ProjectImage[];
}

export interface Project {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  introText?: string;
  moreContent?: string;
  images?: ProjectImage[];
  imageGalleries?: ImageGallery[];
  projectDetails?: ProjectDetail[];
  category?: string;
  featured?: boolean;
  link?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

/**
 * Get all projects with pagination and filtering
 */
export const getProjects = async (params?: ProjectQueryParams): Promise<ProjectsResponse> => {
  const response = await axiosApi.get<ProjectsResponse>('/projects', { params });
  return response.data;
};

/**
 * Get single project by slug
 */
export const getProjectBySlug = async (slug: string): Promise<ProjectResponse> => {
  const response = await axiosApi.get<ProjectResponse>(`/projects/${slug}`);
  return response.data;
};

/**
 * Create new project (admin only)
 */
export const createProject = async (project: Project): Promise<ProjectResponse> => {
  const response = await axiosApi.post<ProjectResponse>('/admin/projects', project);
  return response.data;
};

/**
 * Update project (admin only)
 */
export const updateProject = async (id: string, project: Partial<Project>): Promise<ProjectResponse> => {
  const response = await axiosApi.put<ProjectResponse>(`/admin/projects/${id}`, project);
  return response.data;
};

/**
 * Delete project (admin only)
 */
export const deleteProject = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosApi.delete(`/admin/projects/${id}`);
  return response.data;
};
