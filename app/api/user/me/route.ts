import { UserBackendFormProps } from "@/type/user";
import { createCRUDHandlers } from "@/utils/server/crudFactory";

const handlers = createCRUDHandlers<UserBackendFormProps>({
  table: 'users',
  requiredFields: ['name', 'role'],
  searchFields: ['name'],
});

export const {GET, PUT} = handlers;
