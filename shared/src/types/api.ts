export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface HealthCheck {
  status: string;
  service: string;
  timestamp: string;
} 