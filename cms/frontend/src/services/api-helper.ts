import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export class ApiHelper {
  static async get<T>(endpoint: string): Promise<T | null> {
    try {
      const { data } = await axios.get(`${API_URL}${endpoint}`);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`GET ${endpoint}:`, error);
      return null;
    }
  }

  static async post<T>(endpoint: string, payload: any): Promise<T | null> {
    try {
      const { data } = await axios.post(`${API_URL}${endpoint}`, payload);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`POST ${endpoint}:`, error);
      return null;
    }
  }

  static async put<T>(endpoint: string, payload: any): Promise<T | null> {
    try {
      const { data } = await axios.put(`${API_URL}${endpoint}`, payload);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`PUT ${endpoint}:`, error);
      return null;
    }
  }

  static async delete<T>(endpoint: string): Promise<T | null> {
    try {
      const { data } = await axios.delete(`${API_URL}${endpoint}`);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`DELETE ${endpoint}:`, error);
      return null;
    }
  }
}
