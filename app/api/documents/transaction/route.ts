import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

const transactionTemplateHandlers = createCRUDHandlers<TransactionDocumentBase>({
  table: 'document_transactions',
  requiredFields: ['partner_document_id','application_id', 'buyer_id', 'populated_data', 'generated_document_url','status'],
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
  
});

export const { GET, PUT, POST, PATCH } = transactionTemplateHandlers;