import { ApiHelper } from "./api-helper";

export const tagService = {
  getAll: () => ApiHelper.get("/api/admin/tags"),
  create: (data: any) => ApiHelper.post("/api/admin/tags", data),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/tags/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/tags/${id}`),
};
