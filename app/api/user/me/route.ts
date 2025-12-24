import { UserBackendFormProps } from "@/type/user";
import { createCRUDHandlers } from "@/utils/server/crudFactory";

export const handlers = createCRUDHandlers<UserBackendFormProps>({
  table: 'users',
  requiredFields: ['name', 'role'],
  searchFields: ['name'],
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;