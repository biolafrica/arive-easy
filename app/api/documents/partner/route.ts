import { PartnerDocumentBase } from "@/type/pages/dashboard/documents";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest } from "next/server";

const partnerTemplateHandlers = createCRUDHandlers<PartnerDocumentBase>({
  table: 'partner_documents',
  requiredFields: ['document_name','template_id', 'template_version', 'partner_id', 'partner_type', 'document_name',],
  searchFields: ['document_name'],
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
        role: user.app_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      if (!context.auth?.userId) {
        return false;
      }
      return true;
    }
  },
  hooks: {
    beforeCreate:async(body, context)=>{
      const partnerQueryBuilder = new SupabaseQueryBuilder<PartnerDocumentBase>("partner_documents");

      const now = new Date().toISOString();
      body.created_at = now;
      body.updated_at = now;
      body.partner_id = context.auth?.userId!;

      const existingTemplate = await partnerQueryBuilder.findOneByCondition({
        document_type: body.document_type,
        status: 'active',
        partner_id: context.auth?.userId!,

      })

      if(existingTemplate){ 
        body.template_version = existingTemplate.template_version + 1
        await partnerQueryBuilder.update(existingTemplate.id, {
          status: 'archived', 
          updated_at: now 
        })
      }else{
        body.template_version = 1
      }

      body.status = 'active'; 

    }
  }
  
});

export const { GET, PUT, POST, PATCH } = partnerTemplateHandlers;