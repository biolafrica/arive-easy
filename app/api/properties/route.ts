import { PropertyForm } from "@/type/pages/property";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";


const propertyHandlers = createCRUDHandlers<PropertyForm>({
  table: 'properties',
  requiredFields: ['title', 'description', 'property_type', 'price', 'city'],
  searchFields: ['title'],
  defaultSort: {
    field: 'created_at',
    order: 'desc'
  },

});

export const { GET, POST, PUT, DELETE } = propertyHandlers;
