/**
 * Standard API response types for the CMS backend
 */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type PaginationInfo = Pagination;

export interface ApiError {
  code?: string;
  message: string;
  details?: string | any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
  error?: ApiError;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}
