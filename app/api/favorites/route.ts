import { FavoriteForm } from "@/type/pages/dashboard/favorite";
import { optionalAuth,} from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

const propertyHandlers = createCRUDHandlers<FavoriteForm>({
  table: 'user_favorites',
  requiredFields: ['property_id', 'user_id'],
  searchFields: ['property_id'],
  middleware:{
    auth: async(request:NextRequest)=>{
      const user = await optionalAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.app_metadata.role,
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
        case 'seller':
          return ['read', 'list', 'create', 'update'].includes(action);
        default:
          return false;
      }
    },

   

  }

});

export const { GET, POST, DELETE, PUT } = propertyHandlers;