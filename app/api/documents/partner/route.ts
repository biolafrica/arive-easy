import { PartnerDocumentBase } from "@/type/pages/dashboard/documents";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
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

export const { GET, PUT, POST, PATCH } = partnerTemplateHandlers;