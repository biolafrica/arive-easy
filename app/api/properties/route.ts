import { PropertyForm } from "@/type/pages/property";
import { createCRUDHandlers } from "@/utils/server/crudFactory";


export const propertyHandlers = createCRUDHandlers<PropertyForm>({
  table: 'properties',
  requiredFields: ['title', 'description', 'property-type', 'price', 'city'],
  searchFields: ['title'],
  defaultSort: {
    field: 'created_at',
    order: 'desc'
  },
});

export const GET = propertyHandlers.GET;
