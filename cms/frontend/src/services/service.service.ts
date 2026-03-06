import { ApiHelper } from "./api-helper";

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string | { url: string; alt?: string };
  icon?: string;
  order: number;
  displayImage?: { url: string; alt?: string };
  bannerImage?: { url: string; alt?: string };
  servicesList?: any[];
  keyActivities?: any[];
  features?: any[];
  metaTags?: Array<{ name: string; content: string }>;
  customHeadTags?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  data: Service[];
  pagination?: {
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
