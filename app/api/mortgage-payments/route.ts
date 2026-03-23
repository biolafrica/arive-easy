import { MortgagePayment } from "@/type/pages/dashboard/mortgage";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

const mortgagePaymentHandlers = createCRUDHandlers<MortgagePayment>({
  table: 'mortgage_payments',
  requiredFields: ['mortgage_id', 'application_id', ],
  searchFields: ['mortgage_id', 'application_id'],
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
          return action === 'read' || action === 'list';
        default:
          return false;
      }
    },

  },

});

export const { GET, POST, PUT, DELETE } = mortgagePaymentHandlers;