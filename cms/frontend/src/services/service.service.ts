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
  bannerImage?: { url: string; alt?: string };
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

export const serviceService = {
  getAll: () => ApiHelper.get("/api/admin/services"),
  getById: (id: string) => ApiHelper.get(`/api/admin/services/${id}`),
  create: (data: any) => ApiHelper.post("/api/admin/services", data),
  update: (id: string, data: any) => ApiHelper.put(`/api/admin/services/${id}`, data),
  delete: (id: string) => ApiHelper.delete(`/api/admin/services/${id}`),
};

export async function createService(data: any): Promise<any> {
  return ApiHelper.post("/api/admin/services", data);
}

export async function updateService(id: string, data: any): Promise<any> {
  return ApiHelper.put(`/api/admin/services/${id}`, data);
}

export async function deleteService(id: string): Promise<any> {
  return ApiHelper.delete(`/api/admin/services/${id}`);
}

export async function getServices(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ServicesResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", String(params.page));
  if (params.limit) queryParams.append("limit", String(params.limit));
  if (params.search) queryParams.append("search", params.search);

  const response = await ApiHelper.get<ServicesResponse>(
    `/api/admin/services?${queryParams.toString()}`
  );
  return response || { data: [] };
}

export async function getServiceBySlug(slug: string): Promise<any> {
  return ApiHelper.get(`/api/admin/services/slug/${slug}`);
}
