import { ApiHelper } from "./api-helper";

export interface Service {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description?: string;
  [key: string]: any;
}

export interface ServicesResponse {
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getServices = (params?: any) =>
  ApiHelper.get<ServicesResponse>("/admin/services", { params });

export const getServiceBySlug = (slug: string) =>
  ApiHelper.get<Service>(`/admin/services/${slug}`);

export const createService = (params: any) =>
  ApiHelper.post<Service>("/admin/services", params);

export const updateService = (id: string, params: any) =>
  ApiHelper.put<Service>(`/admin/services/${id}`, params);

export const deleteService = (id: string) =>
  ApiHelper.delete(`/admin/services/${id}`);

export const serviceService = {
  getAll: getServices,
  getById: getServiceBySlug,
  create: createService,
  update: updateService,
  delete: deleteService,
};
