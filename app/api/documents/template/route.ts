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
        role: user.user_metadata.role,
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
          replaced_by: body.slug,
          updated_at: now 
        })

      } else{
        body.version = 1
      }

      if (body.uses_signwell !== false) {
        body.uses_signwell = true;
        body.signwell_integration_status = 'pending';
        body.signwell_template_id = null;
        body.signwell_error_message = null;
        body.signwell_created_at = null;
      } else {
        body.uses_signwell = false;
        body.signwell_integration_status = null;
      }
  
    },
    afterCreate:async(created, body, context)=> {
      if (created.uses_signwell && created.template_file_url) {
        createSignwellTemplateAsync(created).catch(error => {
          console.error(`SignWell template creation failed for ${created.id}:`, error);
        });
      }

    },
  }
});

async function createSignwellTemplateAsync(template: TemplateBase) {
  const templateQueryBuilder = new SupabaseQueryBuilder<TemplateBase>("document_templates");
  
  try {
    console.log(`Creating SignWell template for: ${template.name}`);

    const signwellTemplate = await createSignwellTemplate({
      name: template.name,
      description: template.description || '',
      file_url: template.template_file_url!,
      template_fields: template.template_fields
    });

    await templateQueryBuilder.update(template.id, {
      signwell_template_id: signwellTemplate.id,
      signwell_integration_status: 'success',
      signwell_created_at: new Date().toISOString(),
      signwell_error_message: null,
      updated_at: new Date().toISOString()
    });


  } catch (error) {
    console.error(` SignWell template creation failed for ${template.id}:`, error);

    await templateQueryBuilder.update(template.id, {
      signwell_integration_status: 'failed',
      signwell_error_message: error instanceof Error ? error.message : 'Unknown error',
      updated_at: new Date().toISOString()
    });
  }
}

async function createSignwellTemplate({
  name,
  description,
  file_url,
  template_fields
}: {
  name: string;
  description: string;
  file_url: string;
  template_fields: any[];
}): Promise<{ id: string; name: string }> {

  const SIGNWELL_API_KEY = process.env.SIGNWELL_API_KEY;
  const SIGNWELL_API_URL = 'https://www.signwell.com/api/v1/document_templates/';

  if (!SIGNWELL_API_KEY) {
    console.warn('SignWell API key not configured - using mock data');
    return {
      id: `mock_template_${Date.now()}`,
      name: name
    };
  }

  const transformed = template_fields.map(item => ({
    id: item.id,
    name: item.placeholder
  }));

  try {
    const options={
      method: 'POST',
      headers:{
        accept: 'application/json',
        'content-type': 'application/json',
        'X-Api-Key': SIGNWELL_API_KEY
      },
      body:JSON.stringify({
        draft: true,
        reminders: true,
        apply_signing_order: false,
        text_tags: false,
        allow_decline: true,
        allow_reassign: true,
        files:[
          {
            name:`${name.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`,
            file_url:file_url
          }
        ],
        name,
        subject:`Please sign: ${name}`,
        message:`Please review and sign this document.`,
        placeholders:transformed
      })
    }

    const response = await fetch(SIGNWELL_API_URL,options);


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SignWell API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return {
      id: result.id,
      name: result.name || name
    };

  } catch (error) {
    throw new Error(`Failed to create SignWell template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const { GET, PUT, POST, PATCH } = documentTemplateHandlers;