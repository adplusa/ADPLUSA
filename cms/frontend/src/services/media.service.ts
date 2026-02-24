import { ApiHelper } from "./api-helper";

export const mediaService = {
  getAll: () => ApiHelper.get("/api/admin/media"),
  getById: (id: string) => ApiHelper.get(`/api/admin/media/${id}`),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/media/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/media/${id}`),
};
