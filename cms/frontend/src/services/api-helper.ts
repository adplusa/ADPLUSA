import { axiosApi } from "./axios";

export class ApiHelper {
  static async get<T>(endpoint: string, config?: any): Promise<T | null> {
    try {
      const { data } = await axiosApi.get<any>(endpoint, config);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`GET ${endpoint}:`, error);
      throw error;
    }
  }

  static async post<T>(endpoint: string, payload: any): Promise<T | null> {
    try {
      const { data } = await axiosApi.post<any>(endpoint, payload);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`POST ${endpoint}:`, error);
      throw error;
    }
  }

  static async put<T>(endpoint: string, payload: any): Promise<T | null> {
    try {
      const { data } = await axiosApi.put<any>(endpoint, payload);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`PUT ${endpoint}:`, error);
      throw error;
    }
  }

  static async delete<T>(endpoint: string): Promise<T | null> {
    try {
      const { data } = await axiosApi.delete<any>(endpoint);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`DELETE ${endpoint}:`, error);
      throw error;
    }
  }
}
