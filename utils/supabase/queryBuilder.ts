import { supabaseAdmin } from './supabaseAdmin';

interface JoinConfig {
  table: string;
  on?: string;
  select?: string;
  type?: 'inner' | 'left';
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  joins?: JoinConfig[];
  select?: string;
}

export class SupabaseQueryBuilder<T> {
  private selectFields: string = '*';
  private joins: JoinConfig[] = [];
  
  constructor(private table: string) {}

  // Chainable method to set select fields
  select(fields: string) {
    this.selectFields = fields;
    return this;
  }

  // Chainable method to add joins
  join(config: JoinConfig) {
    this.joins.push(config);
    return this;
  }

  // Reset builder state
  private reset() {
    this.selectFields = '*';
    this.joins = [];
  }

  private buildSelectQuery(select?: string) {
    let selectQuery = select || this.selectFields;
    
    // Handle joins in select statement
    if (this.joins.length > 0) {
      const joinSelects = this.joins
        .map(join => {
          const joinSelect = join.select || '*';
          return `${join.table}!${join.type === 'left' ? 'left' : 'inner'}(${joinSelect})`;
        })
        .join(',');
      
      selectQuery = selectQuery === '*' 
        ? `*, ${joinSelects}`
        : `${selectQuery}, ${joinSelects}`;
    }
    
    return selectQuery;
  }

  async findById(id: string, options?: { select?: string; joins?: JoinConfig[] }) {
    try {
      if (options?.joins) {
        options.joins.forEach(join => this.join(join));
      }
      
      const selectQuery = this.buildSelectQuery(options?.select);
      
      const { data, error } = await supabaseAdmin
        .from(this.table)
        .select(selectQuery)
        .eq('id', id)
        .single();

      this.reset();
      
      if (error) throw error;
      return data as T;
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  async findAll(options?: { select?: string; joins?: JoinConfig[] }) {
    try {
      if (options?.joins) {
        options.joins.forEach(join => this.join(join));
      }
      
      const selectQuery = this.buildSelectQuery(options?.select);
      
      const { data, error } = await supabaseAdmin
        .from(this.table)
        .select(selectQuery);

      this.reset();
      
      if (error) throw error;
      return data as T[];
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  async findByCondition(column: string, value: any, options?: { select?: string; joins?: JoinConfig[] }) {
    try {
      if (options?.joins) {
        options.joins.forEach(join => this.join(join));
      }
      
      const selectQuery = this.buildSelectQuery(options?.select);
      
      const { data, error } = await supabaseAdmin
        .from(this.table)
        .select(selectQuery)
        .eq(column, value);

      this.reset();
      
      if (error) throw error;
      return data as T[];
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  async findOneByCondition(
    columnOrConditions: string | Record<string, any>,
    valueOrOptions?: any,
    optionsOrUndefined?: { select?: string; joins?: JoinConfig[] }
  ) {
    try {
      let conditions: Record<string, any>;
      let options: { select?: string; joins?: JoinConfig[] } | undefined;

      if (typeof columnOrConditions === 'string') {
        conditions = { [columnOrConditions]: valueOrOptions };
        options = optionsOrUndefined;
      } else {
        conditions = columnOrConditions;
        options = valueOrOptions;
      }

      if (options?.joins) {
        options.joins.forEach(join => this.join(join));
      }

      const selectQuery = this.buildSelectQuery(options?.select);
      let query = supabaseAdmin
      .from(this.table)
      .select(selectQuery);


      Object.entries(conditions).forEach(([column, value]) => {
        query = query.eq(column, value);
      });

      const { data, error } = await query.maybeSingle();

      this.reset();

      if (error) throw error;
      return data as T | null;
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  async create(payload: Partial<T>) {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async createMany(payloads: Partial<T>[]) {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert(payloads)
      .select();

    if (error) throw error;
    return data as T[];
  }

  async update(id: string, payload: Partial<T>) {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async updateMany(ids: string[], payload: Partial<T>) {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .in('id', ids)
      .select();

    if (error) throw error;
    return data as T[];
  }

  async upsert(payload: Partial<T>, conflictColumns?: string[]) {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .upsert([payload], { 
        onConflict: conflictColumns?.join(',') || 'id' 
      })
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async deleteMany(ids: string[]) {
    const { error } = await supabaseAdmin
      .from(this.table)
      .delete()
      .in('id', ids);

    if (error) throw error;
    return true;
  }

  async findPaginated({
    page = 1,
    limit = 10,
    search = '',
    searchFields = ['title', 'description'],
    sortBy = 'created_at',
    sortOrder = 'desc',
    filters = {},
    joins = [],
    select
  }: PaginationParams) {
    try {
      // Add joins if provided
      joins.forEach(join => this.join(join));
      
      const selectQuery = this.buildSelectQuery(select);
      
      let query = supabaseAdmin
        .from(this.table)
        .select(selectQuery, { count: 'exact' });

      // Apply search
      if (search && searchFields.length > 0) {
        const searchQuery = searchFields
          .map(field => `${field}.ilike.%${search}%`)
          .join(',');
        query = query.or(searchQuery);
      }

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object' && value.operator) {
            // Support for advanced filters like { operator: 'gte', value: 10 }
            const { operator, value: filterValue } = value;
            switch (operator) {
              case 'gte':
                query = query.gte(key, filterValue);
                break;
              case 'gt':
                query = query.gt(key, filterValue);
                break;
              case 'lte':
                query = query.lte(key, filterValue);
                break;
              case 'lt':
                query = query.lt(key, filterValue);
                break;
              case 'neq':
                query = query.neq(key, filterValue);
                break;
              case 'like':
                query = query.like(key, filterValue);
                break;
              case 'ilike':
                query = query.ilike(key, filterValue);
                break;
              case 'is':
                query = query.is(key, filterValue);
                break;
              default:
                query = query.eq(key, filterValue);
            }
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      this.reset();

      if (error) throw error;

      return {
        data: data as T[],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
          hasNextPage: page < Math.ceil((count || 0) / limit),
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  async count(filters: Record<string, any> = {}) {
    let query = supabaseAdmin
      .from(this.table)
      .select('*', { count: 'exact', head: true });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }

  async countWithConditions(conditions: Record<string, any> = {}) {
    try {
      let query = supabaseAdmin
        .from(this.table)
        .select('*', { count: 'exact', head: true });

      Object.entries(conditions).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object' && value.operator) {
            const { operator, value: filterValue } = value;
            switch (operator) {
              case 'gte':
                query = query.gte(key, filterValue);
                break;
              case 'gt':
                query = query.gt(key, filterValue);
                break;
              case 'lte':
                query = query.lte(key, filterValue);
                break;
              case 'lt':
                query = query.lt(key, filterValue);
                break;
              case 'neq':
                query = query.neq(key, filterValue);
                break;
              case 'is':
                query = query.is(key, filterValue);
                break;
              default:
                query = query.eq(key, filterValue);
            }
          } else {
            query = query.eq(key, value);
          }
        }
      });

      const { count, error } = await query;

      if (error) throw error;
      return count || 0;
    } catch (error) {
      throw error;
    }
  }

  async sumWithConditions(column: any, conditions: Record<string, any> = {}) {
    try {
      let query = supabaseAdmin
        .from(this.table)
        .select(column);

      Object.entries(conditions).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object' && value.operator) {
            const { operator, value: filterValue } = value;
            switch (operator) {
              case 'gte': query = query.gte(key, filterValue); break;
              case 'gt': query = query.gt(key, filterValue); break;
              case 'lte': query = query.lte(key, filterValue); break;
              case 'lt': query = query.lt(key, filterValue); break;
              case 'neq': query = query.neq(key, filterValue); break;
              case 'is': query = query.is(key, filterValue); break;
              default: query = query.eq(key, filterValue);
            }
          } else {
            query = query.eq(key, value);
          }
        }
      });

      const { data, error } = await query;

      if (error) throw error;
      
      // Calculate sum from the returned data
      const sum = data?.reduce((acc, row) => acc + (Number(row[column]) || 0), 0) || 0;
      return sum;
    } catch (error) {
      throw error;
    }
  }

}

// Export a factory function for creating typed query builders
export function createQueryBuilder<T>(table: string) {
  return new SupabaseQueryBuilder<T>(table);
}