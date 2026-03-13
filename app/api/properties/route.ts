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
        role: user.user_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      if (action === 'read' || action === 'list' || action === 'delete') {
        return true;
      }
      
      if (!context.auth?.userId) {
        return false;
      }

      if (action === 'create' || action === 'update') {
        if (action === 'create' && context.auth.roles?.includes('seller')) {
          return true;
        }

        return true
      }

      return false;
      
    }
  },
  hooks:{
    beforeCreate:async(body, context)=>{
      body.developer_id = context.auth?.userId!
      
    },
  }

});

export const { GET, POST, PUT, DELETE } = propertyHandlers;
