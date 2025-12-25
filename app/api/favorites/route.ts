import { FavoriteForm } from "@/type/pages/dashboard/favorite";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

const propertyHandlers = createCRUDHandlers<FavoriteForm>({
  table: 'user_favorites',
  requiredFields: ['property_id', 'user_id'],
  searchFields: ['property_id'],
  middleware:{
    auth: async(request:NextRequest)=>{
      const user = await requireAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.user_metadata.role,
        auth: user.role ? true : false,

      } : null
    },

    permissions: async(action,context)=>{
      if (!context.auth?.userId) {
        return false;
      }
      return true

    }

  }

});

export const { GET,POST,DELETE,PUT } = propertyHandlers;