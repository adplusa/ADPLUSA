import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Get authorization header
function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

export class ApiHelper {
  static async get<T = any>(endpoint: string): Promise<T | null> {
    try {
      const { data } = await axios.get(`${API_URL}${endpoint}`, {
        headers: getAuthHeader(),
      });
      return data.success ? data : null;
    } catch (error) {
      console.error(`GET ${endpoint}:`, error);
      throw error;
    }
  }

  static async post(endpoint: string, payload: any): Promise<any> {
    try {
      const { data } = await axios.post(`${API_URL}${endpoint}`, payload, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (error) {
      console.error(`POST ${endpoint}:`, error);
      throw error;
    }
  }

  static async put<T = any>(endpoint: string, payload: any): Promise<T | null> {
    try {
      const { data } = await axios.put(`${API_URL}${endpoint}`, payload, {
        headers: getAuthHeader(),
      });
      return data.success ? data : null;
    } catch (error) {
      console.error(`PUT ${endpoint}:`, error);
      throw error;
    }
  }

  static async delete<T = any>(endpoint: string): Promise<T | null> {
    try {
      const { data } = await axios.delete(`${API_URL}${endpoint}`, {
        headers: getAuthHeader(),
      });
      return data.success ? data : null;
    } catch (error) {
      console.error(`DELETE ${endpoint}:`, error);
      throw error;
    }
  }
}
