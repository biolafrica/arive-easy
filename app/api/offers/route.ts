import { OfferBase } from "@/type/pages/dashboard/offer";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

const OffersHandlers = createCRUDHandlers<OfferBase>({
  table: 'offers',
  requiredFields: ['user_id', 'application_id'],
  searchFields: ['property_name'],
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
  hooks:{
    afterUpdate:async(context,)=>{
      //send email to the user 
    }
  }
});

export const { GET, PUT, POST, PATCH } = OffersHandlers;
