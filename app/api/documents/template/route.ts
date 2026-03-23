import { TemplateBase } from "@/type/pages/dashboard/documents";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest } from "next/server";

const documentTemplateHandlers = createCRUDHandlers<TemplateBase>({
  table: 'document_templates',
  requiredFields: ['name', 'slug', 'type', 'category', 'version', 'template_file_url', 'template_fields',],
  searchFields: ['name'],
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
  hooks:{
    beforeCreate:async(body, context)=>{
      const templateQueryBuilder = new SupabaseQueryBuilder<TemplateBase>("document_templates");
      const now = new Date().toISOString();

      body.created_at = now;
      body.updated_at = now;
      body.created_by = context.auth?.userId!;

      const existingTemplate = await templateQueryBuilder.findOneByCondition({
        type: body.type,
        status: 'active'
      })

      if(existingTemplate){
        body.version = existingTemplate.version + 1;
        body.parent_template_id = existingTemplate.id;

        await templateQueryBuilder.update(existingTemplate.id, {
          status: 'inactive', 
          replaced_by: body.id,
          updated_at: now 
        })

      } else{
        body.version = 1
      }

  
    },
  }
});


export const { GET, PUT, POST, PATCH } = documentTemplateHandlers;