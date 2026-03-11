import { ApplicationBase } from "@/type/pages/dashboard/application";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { PropertyBase,} from "@/type/pages/property";
import { UserBase } from "@/type/user";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest } from "next/server";
import { executeStageHandlers } from "@/utils/server/applicationStageHandlers";

const applicationHandlers = createCRUDHandlers<ApplicationBase>({
  table: 'applications',
  requiredFields: ['user_id', 'pre_approval_id', 'application_number'],
  searchFields: ['property_name'],
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
      console.log('context', context.auth)
      if (!context.auth?.userId) {
        return false;
      }
      return true;
    }
  },
  hooks: {
    afterUpdate: async (updated, previous, context) => {
      try {
        const stageContext = {
          propertyQB: new SupabaseQueryBuilder<PropertyBase>('properties'),
          offerQB: new SupabaseQueryBuilder<OfferBase>('offers'),
          userQB: new SupabaseQueryBuilder<UserBase>('users'),
        };

        await executeStageHandlers(updated, stageContext);
      } catch (error) {
        console.error('Error in afterUpdate hook:', error);
      }
 
    }
  }
});


export const { GET, PUT, POST, PATCH } = applicationHandlers;