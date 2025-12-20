import { toast } from 'sonner';

// API Response types matching our backend
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  metadata?: {
    timestamp?: string;
    duration?: number;
    [key: string]: any;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    field?: string;
    timestamp?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API Client configuration
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: ApiError) => void;
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  onResponse?: <T>(response: ApiResponse<T>) => void;
}

function serializeParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue !== undefined && nestedValue !== null) {
          // Use dot notation for nested params (e.g., filters.status=active)
          searchParams.append(`${key}.${nestedKey}`, String(nestedValue));
        }
      });
    } else if (Array.isArray(value)) {
      // For arrays, append each item with the same key
      value.forEach(item => {
        searchParams.append(key, String(item));
      });
    } else {
      // For primitive values
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private onError?: (error: ApiError) => void;
  private onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  private onResponse?: <T>(response: ApiResponse<T>) => void;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || process.env.NEXT_PUBLIC_API_URL || '';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.onError = config.onError;
    this.onRequest = config.onRequest;
    this.onResponse = config.onResponse;
  }

  private async getAuthToken(): Promise<string | null> {
    // Implement your auth token retrieval logic
    // This could be from localStorage, cookies, or a state management solution
    if (typeof window !== 'undefined') {
      // Client-side
      return localStorage.getItem('auth_token');
    }
    // Server-side (Next.js)
    return null;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: {
          code: 'UNKNOWN_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }));

      // Call global error handler if provided
      if (this.onError) {
        this.onError(errorData);
      }

      // Handle specific error codes
      if (response.status === 401) {
        // Redirect to login or refresh token
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      throw errorData;
    }

    const data: ApiResponse<T> = await response.json();
    
    // Call global response handler if provided
    if (this.onResponse) {
      this.onResponse(data);
    }

    // Return the data directly if it exists, otherwise return the whole response
    return (data.data !== undefined ? data.data : data) as T;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();

    // Prepare headers
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Prepare request config
    let config: RequestInit = {
      ...options,
      headers,
    };

    // Apply request interceptor if provided
    if (this.onRequest) {
      config = await this.onRequest(config);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw {
          error: {
            code: 'TIMEOUT',
            message: 'Request timeout',
          },
        };
      }
      
      throw error;
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? `?${serializeParams(params)}` : '';
    return this.request<T>(`${endpoint}${searchParams}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const token = await this.getAuthToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Note: Don't set Content-Type for FormData, let the browser set it
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// Create singleton instance with error handling
export const apiClient = new ApiClient({
  onError: (error) => {
    // Global error handling
    console.error('API Error:', error);
    
    // Show toast notification for user-facing errors
    if (typeof window !== 'undefined') {
      toast.error(error.error.message || 'An error occurred');
    }
  },
  onRequest: (config) => {
    // Add any global request modifications here
    // For example, add correlation ID for tracking
    if (typeof window !== 'undefined') {
      (config.headers as Record<string, string>)['X-Request-ID'] = 
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return config;
  },
});

// Export types
export type { ApiClient };
export default apiClient;