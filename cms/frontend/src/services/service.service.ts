import { ApiHelper } from "./api-helper";

export const serviceService = {
  getAll: () => ApiHelper.get("/api/admin/services"),
  getById: (id: string) => ApiHelper.get(`/api/admin/services/${id}`),
  create: (data: any) => ApiHelper.post("/api/admin/services", data),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/services/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/services/${id}`),
};
