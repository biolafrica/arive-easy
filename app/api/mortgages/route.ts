import { Mortgage } from "@/type/pages/dashboard/mortgage";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

const mortgageHandlers = createCRUDHandlers<Mortgage>({
  table: 'mortgages',
  requiredFields: ['property_price','application_id', 'user_id'],
  searchFields: ['user_name'],
  defaultSort: {
    field: 'created_at',
    order: 'desc'
  },
  middleware:{
    auth:async(request:NextRequest)=>{
      const user = await requireAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.app_metadata.role,
        name:user.user_metadata.name,
        auth: user.role ? true : false,

      } : null
    },
    permissions: async (action, context) => {
      const role = context.auth?.role;
      const userId = context.auth?.userId;

      if (!userId) return false;

      switch (role) {
        case 'admin':
          return true;
        case 'user':
          return ['create', 'read', 'list'].includes(action);
        default:
          return false;
      }
    },

  },

});

export const { GET, POST, PUT, DELETE } = mortgageHandlers;