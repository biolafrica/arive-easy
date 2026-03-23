import { PropertyBase } from "@/type/pages/property";
import { optionalAuth,} from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";


const propertyHandlers = createCRUDHandlers<PropertyBase>({
  table: 'properties',
  requiredFields: ['title', 'description', 'property_type', 'price', 'city'],
  searchFields: ['title'],
  defaultSort: {
    field: 'created_at',
    order: 'desc'
  },
  middleware: {
    auth: async (request: NextRequest) => {
      const user = await optionalAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.app_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      const role = context.auth?.role;

      if (action === 'read' || action === 'list') return true;

      if (!context.auth?.userId) return false;

      switch (role) {
        case 'admin':
          return true;
        case 'seller':
          return ['create', 'read', 'list', 'update', 'delete'].includes(action);
        case 'user':
          return action === 'update';
        default:
          return false;
      }
    },
  },
  hooks:{
    beforeCreate:async(body, context)=>{
      body.developer_id = context.auth?.userId!
      
    },
  }

});

export const { GET, POST, PUT, DELETE } = propertyHandlers;
