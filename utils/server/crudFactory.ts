import { NextRequest, NextResponse } from "next/server";
import * as response from "./serverResponse";
import { SupabaseQueryBuilder } from "../supabase/queryBuilder";


export interface CRUDConfig<T> {
  table: string;
  requiredFields?: string[];
  searchFields?: string[];
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  hooks?: CRUDHooks<T>;
  customHandlers?: CustomHandlers<T>;
  middleware?: MiddlewareConfig;
  validation?: ValidationConfig<T>;
  caching?: CachingConfig;
  rateLimit?: RateLimitConfig;
  features?: FeatureFlags;
}

export interface CRUDHooks<T> {
  beforeCreate?: (body: T, context: RequestContext) => Promise<T | void>;
  afterCreate?: (created: T, body: T, context: RequestContext) => Promise<void>;
  beforeUpdate?: (id: string, body: Partial<T>, context: RequestContext) => Promise<Partial<T> | void>;
  afterUpdate?: (updated: T, body: Partial<T>, context: RequestContext) => Promise<void>;
  beforeDelete?: (id: string, context: RequestContext) => Promise<void>;
  afterDelete?: (id: string, context: RequestContext) => Promise<void>;
  beforeRead?: (context: RequestContext) => Promise<void>;
  afterRead?: (data: T | T[], context: RequestContext) => Promise<T | T[]>;
}

export interface CustomHandlers<T> {
  GET?: (request: NextRequest, queryBuilder: SupabaseQueryBuilder<T>, context: RequestContext) => Promise<NextResponse>;
  POST?: (request: NextRequest, queryBuilder: SupabaseQueryBuilder<T>, context: RequestContext) => Promise<NextResponse>;
  PUT?: (request: NextRequest, queryBuilder: SupabaseQueryBuilder<T>, context: RequestContext) => Promise<NextResponse>;
  DELETE?: (request: NextRequest, queryBuilder: SupabaseQueryBuilder<T>, context: RequestContext) => Promise<NextResponse>;
}

export interface MiddlewareConfig {
  auth?: (request: NextRequest) => Promise<AuthContext | null>;
  permissions?: (action: CRUDAction, context: RequestContext) => Promise<boolean>;
  logging?: (action: CRUDAction, context: RequestContext, result?: any) => Promise<void>;
}

export interface ValidationConfig<T> {
  create?: (data: T) => response.ValidationError[] | null;
  update?: (data: Partial<T>) => response.ValidationError[] | null;
  custom?: (action: CRUDAction, data: any) => response.ValidationError[] | null;
}

export interface CachingConfig {
  enabled: boolean;
  ttl?: number;
  invalidateOn?: CRUDAction[];
  keyPrefix?: string;
}

export interface RateLimitConfig {
  enabled: boolean;
  limit?: number;
  windowMs?: number;
  keyExtractor?: (request: NextRequest) => string;
}

export interface FeatureFlags {
  softDelete?: boolean;
  audit?: boolean;
  bulkOperations?: boolean;
}

export interface RequestContext {
  auth?: AuthContext;
  request: NextRequest;
  action: CRUDAction;
  metadata?: Record<string, any>;
}

export interface AuthContext {
  userId?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

export type CRUDAction = 'create' | 'read' | 'update' | 'delete' | 'list' | 'search' | 'bulk';

function extractFilters(request: NextRequest): Record<string, any> {
  const filters: Record<string, any> = {};
  const { searchParams } = new URL(request.url);

  const skipParams = ['page', 'limit', 'search', 'sortBy', 'sortOrder', 'id', 'ids', 'include', 'endpoint'];

  searchParams.forEach((value, key) => {
    if (!skipParams.includes(key)) {
      if (key.startsWith('filters.')) {
        const filterKey = key.replace('filters.', '');
        if (filterKey.includes('.')) {
          const [field, operator] = filterKey.split('.');
          filters[field] = { operator, value };
        } else {
          filters[filterKey] = value.includes(',') ? value.split(',') : value;
        }
      } else if (key.includes('.')) {
        const [field, operator] = key.split('.');
        filters[field] = { operator, value };
      } else {
        filters[key] = value.includes(',') ? value.split(',') : value;
      }
    }
  });

  return filters;
}

export function createCRUDHandlers<T>({
  table,
  requiredFields = [],
  searchFields = ['title', 'description'],
  defaultSort = { field: 'created_at', order: 'desc' },
  hooks = {},
  customHandlers = {},
  middleware = {},
  validation = {},
  caching = { enabled: false },
  rateLimit = { enabled: false },
  features = {},
}: CRUDConfig<T>) {
  const queryBuilder = new SupabaseQueryBuilder<T>(table);

  const createContext = async (
    request: NextRequest,
    action: CRUDAction
  ): Promise<RequestContext> => {
    const authResult = middleware.auth ? await middleware.auth(request) : undefined;
    return {
      auth: authResult ?? undefined,
      request,
      action,
      metadata: {},
    };
  };

  const checkPermissions = async (
    action: CRUDAction,
    context: RequestContext
  ): Promise<boolean> => {
    if (!middleware.permissions) return true;
    return middleware.permissions(action, context);
  };

  const logAction = async (
    action: CRUDAction,
    context: RequestContext,
    result?: any
  ): Promise<void> => {
    if (middleware.logging) {
      await middleware.logging(action, context, result);
    }
  };

  const applyRateLimit = (request: NextRequest): boolean => {
    if (!rateLimit.enabled) return true;

    const key = rateLimit.keyExtractor
      ? rateLimit.keyExtractor(request)
      : request.headers.get('x-forwarded-for') || 'anonymous';

    return response.checkRateLimit(key, rateLimit.limit || 100, rateLimit.windowMs || 60000);
  };

  return {
    GET: async (request: NextRequest) => {
      if (!applyRateLimit(request)) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }

      const id = response.getQueryParam(request, 'id');
      const action: CRUDAction = id ? 'read' : 'list';
      const context = await createContext(request, action);

      if (customHandlers.GET) {
        return customHandlers.GET(request, queryBuilder, context);
      }

      try {
        if (!await checkPermissions(action, context)) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        if (hooks.beforeRead) {
          await hooks.beforeRead(context);
        }

        let data: T | T[] | any;
        let headers = {};

        if (id) {
          const joins = response.getQueryParam(request, 'include')?.split(',').map(table => ({ table }));
          data = await queryBuilder.findById(id, { joins });

          if (caching.enabled) {
            headers = response.cacheHeaders(caching.ttl || 60);
          }
        } else {
          const params = response.getPaginationParams(request);
          const filters = extractFilters(request);
          const joins = response.getQueryParam(request, 'include')?.split(',').map(table => ({ table }));

          data = await queryBuilder.findPaginated({
            ...params,
            searchFields,
            filters,
            joins,
            sortBy: params.sortBy || defaultSort.field,
            sortOrder: params.sortOrder || defaultSort.order,
          });

          headers = caching.enabled
            ? response.cacheHeaders(caching.ttl || 60)
            : response.noCacheHeaders();
        }

        if (hooks.afterRead) {
          data = await hooks.afterRead(data, context);
        }

        await logAction(action, context, { success: true });

        return NextResponse.json({ data }, { status: 200, headers });
      } catch (error) {
        await logAction(action, context, { success: false, error });
        return response.handleError(error);
      }
    },

    POST: async (request: NextRequest) => {
      if (!applyRateLimit(request)) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }

      const context = await createContext(request, 'create');

      if (customHandlers.POST) {
        return customHandlers.POST(request, queryBuilder, context);
      }

      try {
        if (!await checkPermissions('create', context)) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        const body: T = await request.json();

        if (Array.isArray(body) && features.bulkOperations) {
          return handleBulkCreate(body as T[], queryBuilder, hooks, context);
        }

        const validator = new response.Validator(body);

        if (requiredFields.length > 0) {
          validator.required(requiredFields);
        }

        if (validation.create) {
          const errors = validation.create(body);
          if (errors) {
            return NextResponse.json(
              { error: { message: 'Validation failed', details: errors } },
              { status: 422 }
            );
          }
        }

        const validationResult = validator.validate();
        if (!validationResult.isValid) {
          return NextResponse.json(
            { error: { message: 'Validation failed', details: validationResult.errors } },
            { status: 422 }
          );
        }

        let processedBody = body;
        if (hooks.beforeCreate) {
          const result = await hooks.beforeCreate(body, context);
          if (result) processedBody = result;
        }

        if (features.audit && context.auth?.userId) {
          (processedBody as any).created_by = context.auth.userId;
          (processedBody as any).updated_by = context.auth.userId;
        }

        const data = await queryBuilder.create(processedBody);

        if (hooks.afterCreate) {
          await hooks.afterCreate(data, processedBody, context);
        }

        await logAction('create', context, { success: true, id: (data as any).id });

        return response.successResponse(data, 201);
      } catch (error) {
        await logAction('create', context, { success: false, error });
        return response.handleError(error);
      }
    },

    PUT: async (request: NextRequest) => {
      if (!applyRateLimit(request)) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }

      const context = await createContext(request, 'update');

      if (customHandlers.PUT) {
        return customHandlers.PUT(request, queryBuilder, context);
      }

      try {
        const id = response.getQueryParam(request, 'id');

        if (!id) {
          return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        if (!await checkPermissions('update', context)) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        const body: Partial<T> = await request.json();

        if (validation.update) {
          const errors = validation.update(body);
          if (errors) {
            return NextResponse.json(
              { error: { message: 'Validation failed', details: errors } },
              { status: 422 }
            );
          }
        }

        let processedBody = body;
        if (hooks.beforeUpdate) {
          const result = await hooks.beforeUpdate(id, body, context);
          if (result) processedBody = result;
        }

        if (features.audit && context.auth?.userId) {
          (processedBody as any).updated_by = context.auth.userId;
        }

        const data = await queryBuilder.update(id, processedBody);

        if (hooks.afterUpdate) {
          await hooks.afterUpdate(data, processedBody, context);
        }

        await logAction('update', context, { success: true, id });

        return response.successResponse(data);
      } catch (error) {
        await logAction('update', context, { success: false, error });
        return response.handleError(error);
      }
    },

    DELETE: async (request: NextRequest) => {
      if (!applyRateLimit(request)) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }

      const context = await createContext(request, 'delete');

      if (customHandlers.DELETE) {
        return customHandlers.DELETE(request, queryBuilder, context);
      }

      try {
        const id = response.getQueryParam(request, 'id');
        const ids = response.getQueryParam(request, 'ids')?.split(',');

        if (!id && !ids) {
          return NextResponse.json({ error: 'ID or IDs required' }, { status: 400 });
        }

        if (!await checkPermissions('delete', context)) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        if (ids && features.bulkOperations) {
          return handleBulkDelete(ids, queryBuilder, hooks, context, features);
        }

        if (id) {
          if (hooks.beforeDelete) {
            await hooks.beforeDelete(id, context);
          }

          if (features.softDelete) {
            await queryBuilder.update(id, {
              deleted_at: new Date().toISOString(),
              deleted_by: context.auth?.userId,
            } as any);
          } else {
            await queryBuilder.delete(id);
          }

          if (hooks.afterDelete) {
            await hooks.afterDelete(id, context);
          }

          await logAction('delete', context, { success: true, id });

          return response.successResponse({
            deleted_id: id,
            deleted_at: new Date().toISOString(),
          });
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
      } catch (error) {
        await logAction('delete', context, { success: false, error });
        return response.handleError(error);
      }
    },
  };
}

async function handleBulkCreate<T>(
  items: T[],
  queryBuilder: SupabaseQueryBuilder<T>,
  hooks: CRUDHooks<T>,
  context: RequestContext
): Promise<NextResponse> {
  try {
    const processedItems: T[] = [];

    for (const item of items) {
      let processedItem = item;
      if (hooks.beforeCreate) {
        const result = await hooks.beforeCreate(item, context);
        if (result) processedItem = result;
      }
      processedItems.push(processedItem);
    }

    const created = await queryBuilder.createMany(processedItems);

    if (hooks.afterCreate) {
      for (let i = 0; i < created.length; i++) {
        await hooks.afterCreate(created[i], processedItems[i], context);
      }
    }

    return response.successResponse({ data: created, count: created.length }, 201);
  } catch (error) {
    return response.handleError(error);
  }
}

async function handleBulkDelete<T>(
  ids: string[],
  queryBuilder: SupabaseQueryBuilder<T>,
  hooks: CRUDHooks<T>,
  context: RequestContext,
  features: FeatureFlags
): Promise<NextResponse> {
  try {
    for (const id of ids) {
      if (hooks.beforeDelete) {
        await hooks.beforeDelete(id, context);
      }
    }

    if (features.softDelete) {
      await queryBuilder.updateMany(ids, {
        deleted_at: new Date().toISOString(),
        deleted_by: context.auth?.userId,
      } as any);
    } else {
      await queryBuilder.deleteMany(ids);
    }

    for (const id of ids) {
      if (hooks.afterDelete) {
        await hooks.afterDelete(id, context);
      }
    }

    return response.messageResponse(`Deleted ${ids.length} records successfully`);
  } catch (error) {
    return response.handleError(error);
  }
}

export type CRUDHandlers = ReturnType<typeof createCRUDHandlers>;