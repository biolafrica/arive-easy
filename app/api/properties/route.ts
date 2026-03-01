import { PropertyBase } from "@/type/pages/property";
import { requireAuth } from "@/utils/server/authMiddleware";
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
      const user = await requireAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.user_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      if (action === 'read' || action === 'list') {
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
    beforeUpdate:async(updated, previous, context)=>{
      console.log('id', updated)
      console.log('body', previous)
      console.log('user', context.auth)

    }
  }

});

export const { GET, POST, PUT, DELETE } = propertyHandlers;
