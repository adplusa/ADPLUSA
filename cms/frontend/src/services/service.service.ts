import { axiosApi } from './axios';

export interface ServiceImage {
  url: string;
  alt?: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  image?: ServiceImage;
  link?: string;
  isExternal?: boolean;
  order?: number;
}

export interface KeyActivity {
  title: string;
  description: string;
  order?: number;
}

export interface Service {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  bannerImage?: ServiceImage;
  servicesList?: ServiceItem[];
  keyActivities?: KeyActivity[];
  features?: ServiceFeature[];
  image?: ServiceImage;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesResponse {
  success: boolean;
  data: Service[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ServiceResponse {
  success: boolean;
  data: Service;
}

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Get all services with optional pagination and search
 */
export const getServices = async (params?: ServiceQueryParams): Promise<ServicesResponse> => {
  const response = await axiosApi.get<ServicesResponse>('/services', { params });
  return response.data;
};

/**
 * Get single service by slug
 */
export const getServiceBySlug = async (slug: string): Promise<ServiceResponse> => {
  const response = await axiosApi.get<ServiceResponse>(`/services/${slug}`);
  return response.data;
};

/**
 * Create new service (admin only)
 */
export const createService = async (service: Service): Promise<ServiceResponse> => {
  const response = await axiosApi.post<ServiceResponse>('/admin/services', service);
  return response.data;
};

/**
 * Update service (admin only)
 */
export const updateService = async (id: string, service: Partial<Service>): Promise<ServiceResponse> => {
  const response = await axiosApi.put<ServiceResponse>(`/admin/services/${id}`, service);
  return response.data;
};

/**
 * Delete service (admin only)
 */
export const deleteService = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosApi.delete(`/admin/services/${id}`);
  return response.data;
};
