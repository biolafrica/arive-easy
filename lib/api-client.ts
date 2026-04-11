import { createClient } from '@/utils/supabase/client';

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

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: ApiError) => void;
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
}

function serializeParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue !== undefined && nestedValue !== null) {
          searchParams.append(`${key}.${nestedKey}`, String(nestedValue));
        }
      });
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        searchParams.append(key, value.join(','));
      }
    } else {
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

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || process.env.NEXT_PUBLIC_API_URL || '';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.onError = config.onError;
    this.onRequest = config.onRequest;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: {
          code: 'UNKNOWN_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }));

      if (this.onError) {
        this.onError(errorData);
      }

      if (response.status === 401 && typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      throw errorData;
    }

    const data: ApiResponse<T> = await response.json();
    return (data.data !== undefined ? data.data : data) as T;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string>),
    };

    let config: RequestInit = { ...options, headers };

    if (this.onRequest) {
      config = await this.onRequest(config);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw { error: { code: 'TIMEOUT', message: 'Request timeout' } };
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? `?${serializeParams(params)}` : '';
    return this.request<T>(`${endpoint}${searchParams}`, { method: 'GET' });
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

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadToSupabase(
    file: File,
    bucket: string = 'media',
    folder: string = 'uploads'
  ): Promise<string | null> {
    if (!file) return null;

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage.from(bucket).upload(filePath, file);

      if (error) throw new Error(error.message);

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return publicUrl;
    } catch (error: any) {
      console.error('Supabase upload error:', error);
      throw {
        error: {
          code: 'UPLOAD_ERROR',
          message: error.message || 'Failed to upload file',
        },
      };
    }
  }

  async uploadMultipleToSupabase(
    files: Record<string, File | null | undefined>,
    bucket: string = 'media',
    folder: string = 'uploads'
  ): Promise<Record<string, string | null>> {
    const uploadPromises = Object.entries(files).map(async ([key, file]) => {
      if (!file) return [key, null];
      const url = await this.uploadToSupabase(file, bucket, folder);
      return [key, url];
    });

    const results = await Promise.all(uploadPromises);
    return Object.fromEntries(results);
  }
}

export const apiClient = new ApiClient({
  onError: (error) => {
    console.error('API Error:', error);
  },
  onRequest: (config) => {
    if (typeof window !== 'undefined') {
      (config.headers as Record<string, string>)['X-Request-ID'] =
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return config;
  },
});


export type { ApiClient };
export default apiClient;

