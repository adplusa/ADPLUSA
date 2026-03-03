import { ApiHelper } from "./api-helper";

export interface Project {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ProjectsResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getProjects = (params?: any) => 
  ApiHelper.get<ProjectsResponse>("/admin/projects", { params });

export const getProjectBySlug = (slug: string) => 
  ApiHelper.get<Project>(`/admin/projects/${slug}`);

export const createProject = (data: any) => 
  ApiHelper.post<Project>("/admin/projects", data);

export const updateProject = (id: string, data: any) => 
  ApiHelper.put<Project>(`/admin/projects/${id}`, data);

export const deleteProject = (id: string) => 
  ApiHelper.delete(`/admin/projects/${id}`);

export const projectService = {
  getAll: getProjects,
  getById: getProjectBySlug,
  create: createProject,
  update: updateProject,
  delete: deleteProject,
};
