import { axiosApi } from './axios';

export interface ServiceImage {
  url: string;
  darkModeUrl?: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  bannerImage?: ServiceImage;
  features?: ServiceFeature[];
  image?: ServiceImage;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesResponse {
  success: boolean;
  data: Service[];
}

export interface ServiceResponse {
  success: boolean;
  data: Service;
}

/**
 * Get all services
 */
export const getServices = async (): Promise<ServicesResponse> => {
  const response = await axiosApi.get<ServicesResponse>('/services');
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
