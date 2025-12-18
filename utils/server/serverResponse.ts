import { NextRequest, NextResponse } from 'next/server';


export const ERROR_CODES = {
  PGRST116: 'NOT_FOUND',
  '23505': 'DUPLICATE_ENTRY',
  '23503': 'FOREIGN_KEY_VIOLATION',
  '23502': 'NOT_NULL_VIOLATION',
  '23514': 'CHECK_VIOLATION',
  '22001': 'STRING_DATA_TOO_LONG',
  '22P02': 'INVALID_TEXT_REPRESENTATION',
  
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES | (typeof ERROR_CODES)[keyof typeof ERROR_CODES];


interface ErrorResponse {
  error: {
    code: ErrorCode | string;
    message: string;
    details?: any;
    field?: string;
    timestamp?: string;
  };
}


interface SuccessResponse<T = any> {
  data?: T;
  message?: string;
  metadata?: {
    timestamp?: string;
    duration?: number;
    [key: string]: any;
  };
}

export function normalizeError(err: any): ErrorResponse['error'] {
  const timestamp = new Date().toISOString();
  
  if (err.code) {
    return {
      code: err.code,
      message: err.message || getErrorMessage(err.code),
      details: err.details || err.hint,
      timestamp,
    };
  }

  if (err.name === 'ValidationError') {
    return {
      code: 'VALIDATION_ERROR',
      message: err.message || 'Validation failed',
      details: err.errors || err.details,
      timestamp,
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp,
  };
}

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    PGRST116: 'Resource not found',
    '23505': 'This record already exists',
    '23503': 'Cannot perform this action due to related records',
    '23502': 'Required field is missing',
    '23514': 'Data validation failed',
    '22001': 'Input data is too long',
    '22P02': 'Invalid input format',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'You do not have permission to perform this action',
    VALIDATION_ERROR: 'Input validation failed',
    RATE_LIMIT: 'Too many requests, please try again later',
    INTERNAL_ERROR: 'An internal server error occurred',
  };
  
  return messages[code] || 'An error occurred';
}

function getStatusCode(errorCode: string): number {
  const statusMap: Record<string, number> = {
    PGRST116: 404,
    '23505': 409,
    '23503': 400,
    '23502': 400,
    '23514': 400,
    '22001': 400,
    '22P02': 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    VALIDATION_ERROR: 422,
    RATE_LIMIT: 429,
    NOT_FOUND: 404,
  };
  
  return statusMap[errorCode] || 500;
}

export const handleError = (err: any): NextResponse<ErrorResponse> => {
  console.error('API Error:', err);
  
  const error = normalizeError(err);
  const status = getStatusCode(error.code);
  
  return NextResponse.json(
    { error },
    { status }
  );
};

export const successResponse = <T = any>(
  data: T,
  status: number = 200,
  metadata?: SuccessResponse<T>['metadata']
): NextResponse<SuccessResponse<T>> => {
  const response: SuccessResponse<T> = {
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
  
  return NextResponse.json(response, { status });
};

export const messageResponse = (
  message: string,
  status: number = 200,
  data?: any
): NextResponse<SuccessResponse> => {
  return NextResponse.json(
    {
      message,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
};


export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export const validateRequired = (
  data: any,
  requiredFields: string[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  
  requiredFields.forEach(field => {
    const value = getNestedValue(data, field);
    if (value === undefined || value === null || value === '') {
      errors.push({
        field,
        message: `${field} is required`,
        value,
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateLength = (
  value: string,
  min?: number,
  max?: number
): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (min !== undefined && value.length < min) {
    errors.push({
      field: 'length',
      message: `Must be at least ${min} characters long`,
      value: value.length,
    });
  }
  
  if (max !== undefined && value.length > max) {
    errors.push({
      field: 'length',
      message: `Must be no more than ${max} characters long`,
      value: value.length,
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

export const validatePattern = (
  value: string,
  pattern: RegExp,
  message: string
): ValidationResult => {
  const isValid = pattern.test(value);
  
  return {
    isValid,
    errors: isValid ? undefined : [{
      field: 'pattern',
      message,
      value,
    }],
  };
};

// Combined validator
export class Validator {
  private errors: ValidationError[] = [];
  
  constructor(private data: any) {}
  
  required(fields: string[]): this {
    const result = validateRequired(this.data, fields);
    if (result.errors) {
      this.errors.push(...result.errors);
    }
    return this;
  }
  
  email(field: string): this {
    const value = getNestedValue(this.data, field);
    if (value && !validateEmail(value)) {
      this.errors.push({
        field,
        message: 'Invalid email format',
        value,
      });
    }
    return this;
  }
  
  length(field: string, min?: number, max?: number): this {
    const value = getNestedValue(this.data, field);
    if (value && typeof value === 'string') {
      const result = validateLength(value, min, max);
      if (result.errors) {
        this.errors.push({
          field,
          message: result.errors[0].message,
          value,
        });
      }
    }
    return this;
  }
  
  pattern(field: string, pattern: RegExp, message: string): this {
    const value = getNestedValue(this.data, field);
    if (value && typeof value === 'string') {
      const result = validatePattern(value, pattern, message);
      if (result.errors) {
        this.errors.push({
          field,
          message,
          value,
        });
      }
    }
    return this;
  }
  
  custom(validator: (data: any) => ValidationError | null): this {
    const error = validator(this.data);
    if (error) {
      this.errors.push(error);
    }
    return this;
  }
  
  validate(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors.length > 0 ? this.errors : undefined,
    };
  }
}

// Helper function to get nested values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Request helpers
export const getQueryParam = (
  request: NextRequest,
  param: string,
  defaultValue?: string
): string | undefined => {
  const { searchParams } = new URL(request.url);
  return searchParams.get(param) || defaultValue;
};

export const getQueryParams = (
  request: NextRequest,
  params: string[]
): Record<string, string | undefined> => {
  const result: Record<string, string | undefined> = {};
  const { searchParams } = new URL(request.url);
  
  params.forEach(param => {
    result[param] = searchParams.get(param) || undefined;
  });
  
  return result;
};

export const getPaginationParams = (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };
};

// Response caching utilities
export const cacheHeaders = (seconds: number) => ({
  'Cache-Control': `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`,
});

export const noCacheHeaders = () => ({
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
});

// Rate limiting helper (basic implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  key: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || record.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
};

// Cleanup old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 60000); // Clean up every minute