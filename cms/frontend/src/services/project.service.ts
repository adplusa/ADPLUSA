import { ApiHelper } from "./api-helper";

export const projectService = {
  getAll: () => ApiHelper.get("/api/admin/projects"),
  getById: (id: string) => ApiHelper.get(`/api/admin/projects/${id}`),
  create: (data: any) => ApiHelper.post("/api/admin/projects", data),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/projects/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/projects/${id}`),
};
