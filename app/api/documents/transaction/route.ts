import { ApplicationBase } from "@/type/pages/dashboard/application";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest, NextResponse } from "next/server";

const transactionTemplateHandlers = createCRUDHandlers<TransactionDocumentBase>({
  table: 'document_transactions',
  requiredFields: ['application_id', 'generated_document_url'],
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
    },
  
  },
  hooks:{
    beforeCreate:async(body, context)=>{
      const transactionDocumentQueryBuilder = new SupabaseQueryBuilder<TransactionDocumentBase>('document_transactions'); 
      const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>('applications');
   
      try {
        const previousTransactionTemplate = await transactionDocumentQueryBuilder.findOneByCondition({
          application_id: body.application_id,
          document_type:body.document_type
        });

        if(previousTransactionTemplate){
          throw new Error( `you already created ${body.document_type} for this application`)
        }

        const application = await applicationQueryBuilder.findById(body.application_id)
        if(!application){
          throw new Error('application not found')
        }

        const now = new Date().toISOString();

        body.created_at = now;
        body.updated_at = now;
        body.status = 'completed'
        body.buyer_id = application.user_id
        body.seller_id =application.developer_id
        body.property_id = application.property_id
        body.esign_provider = 'anvil'
        
      } catch (error) {
        throw new Error('error creating template')
      }
      
    }
    
  }
  
});

export const { GET, PUT, POST, PATCH } = transactionTemplateHandlers;