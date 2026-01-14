import { MockPreApprovals } from "@/type/pages/dashboard/approval";

interface Props {
  pre_approvals: MockPreApprovals;
}

export default function AdminPreApprovalDetails ({ pre_approvals }: Props){
  return(
    <div>
      <h4>Admin Pre Approval Details</h4>
    </div>
  )
}