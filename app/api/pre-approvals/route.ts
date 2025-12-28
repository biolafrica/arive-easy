import { BackendPreApprovalForm } from "@/type/pages/dashboard/approval";
import { createCRUDHandlers } from "@/utils/server/crudFactory";

const propertyHandlers = createCRUDHandlers<BackendPreApprovalForm>({
  table: 'pre_approvals',
  requiredFields: ['user_id', 'status', 'reference_number',],
});

export const { GET, PUT, POST, PATCH } = propertyHandlers;
