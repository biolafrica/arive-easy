import { ApplicationBase } from "@/type/pages/dashboard/application";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

const propertyHandlers = createCRUDHandlers<ApplicationBase>({
  table: 'applications',
  requiredFields: ['user_id', 'pre_approval_id', 'application_number'],
  searchFields: ['property_id'],
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
        role: user.user_metadata.role,
        name:user.user_metadata.name,
        auth: user.role ? true : false,

      } : null
    },

    permissions:async(action,context)=>{
      if (!context.auth?.userId) {
        return false;
      }

      return true
    }

  },
});

export const { GET, PUT, POST, PATCH } = propertyHandlers;
