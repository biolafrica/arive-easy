import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";


const propertyHandlers = createCRUDHandlers<TransactionBase>({
  table: 'transactions',
  requiredFields: ['user_id', 'application_id'],
  searchFields: ['type','user_name','property_name'],
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
        case 'seller':
          return ['create', 'read', 'list'].includes(action);

        default:
          return false;
      }
    },

  },
  hooks:{
    beforeRead:async(context,)=>{
      console.log('Transaction read context:', context.request.url);
    }
  }
});

export const { GET } = propertyHandlers;
