import { DescriptionList } from "@/components/common/DescriptionList";
import { formatUSD, toNumber } from "@/lib/formatter";
import { PreApprovalBase, PreAprovalStatus } from "@/type/pages/dashboard/approval";
import { PreApprovalActions } from "./PreApprovalAction";
import { useAdminPreApprovalStatus } from "@/hooks/useSpecialized/usePreApproval";
import { StatusHeader } from "./StatusHeader";
import { DocumentsInformationSection, EmploymentInformationSection, PersonalInformationSection, PropertyPreferenceSection } from "../common/ApplicationDescriptionList";


interface Props {
  pre_approvals: PreApprovalBase;
  close:()=>void;
}

export default function AdminPreApprovalDetails ({ pre_approvals, close }: Props){
 
  const { updateStatus, isUpdating } = useAdminPreApprovalStatus(pre_approvals.id);

  const handleSubmit = async (data: PreAprovalStatus) => {
    await updateStatus(data);
    setTimeout(()=>{
      close()
    },1500)
  };

  return(
    <div>
      <StatusHeader status={pre_approvals.status} />

      <div className="space-y-5 mt-5">

        <PersonalInformationSection data={pre_approvals.personal_info} />

        <EmploymentInformationSection data={pre_approvals.employment_info} />

        <PropertyPreferenceSection data={pre_approvals.property_info} />

        <DocumentsInformationSection data={pre_approvals.document_info} />

      </div>

      <PreApprovalActions
        pre_approvals={pre_approvals}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />

    </div>
  )
}