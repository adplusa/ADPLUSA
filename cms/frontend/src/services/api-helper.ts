import { axiosApi } from "./axios";

export class ApiHelper {
  static async get<T = any>(endpoint: string, config?: any): Promise<T> {
    try {
      const { data } = await axiosApi.get<any>(endpoint, config);
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error?.message || 'API request failed');
    } catch (error) {
      console.error(`GET ${endpoint}: `, error);
      throw error;
    }
  }

  static async post<T = any>(endpoint: string, payload: any): Promise<T> {
    try {
      const { data } = await axiosApi.post<any>(endpoint, payload);
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error?.message || 'API request failed');
    } catch (error) {
      console.error(`POST ${endpoint}: `, error);
      throw error;
    }
  }

  static async put<T = any>(endpoint: string, payload: any): Promise<T> {
    try {
      const { data } = await axiosApi.put<any>(endpoint, payload);
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error?.message || 'API request failed');
    } catch (error) {
      console.error(`PUT ${endpoint}: `, error);
      throw error;
    }
  }

  static async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const { data } = await axiosApi.delete<any>(endpoint);
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error?.message || 'API request failed');
    } catch (error) {
      console.error(`DELETE ${endpoint}: `, error);
      throw error;
    }
  }
}
