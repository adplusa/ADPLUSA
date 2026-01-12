/**
 * Standard API response types for the CMS backend
 */

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiError {
  code?: string;
  message: string;
  details?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
  error?: ApiError;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}
