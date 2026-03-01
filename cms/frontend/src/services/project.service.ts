import { ApiHelper } from "./api-helper";

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  data: Project[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const projectService = {
  getAll: () => ApiHelper.get("/api/admin/projects"),
  getById: (id: string) => ApiHelper.get(`/api/admin/projects/${id}`),
  create: (data: any) => ApiHelper.post("/api/admin/projects", data),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/projects/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/projects/${id}`),
};

export async function getProjects(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ProjectsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", String(params.page));
  if (params.limit) queryParams.append("limit", String(params.limit));
  if (params.search) queryParams.append("search", params.search);

  const response = await ApiHelper.get<ProjectsResponse>(
    `/api/admin/projects?${queryParams.toString()}`
  );
  return response || { data: [] };
}

export async function createProject(data: any): Promise<any> {
  return ApiHelper.post("/api/admin/projects", data);
}

export async function updateProject(id: string, data: any): Promise<any> {
  return ApiHelper.put(`/api/admin/projects/${id}`, data);
}

export async function deleteProject(id: string): Promise<any> {
  return ApiHelper.delete(`/api/admin/projects/${id}`);
}

export async function getProjectBySlug(slug: string): Promise<any> {
  return ApiHelper.get(`/api/admin/projects/${slug}`);
}
