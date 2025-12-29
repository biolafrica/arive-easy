
import { EmploymentInfoType} from "@/type/pages/dashboard/approval";
import { usePreApprovalStages, usePreApprovalState } from "@/hooks/useSpecialized/usePreApproval";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/utils/skeleton";
import EmploymentInfoForm from "./EmploymentInfoForm";

export default function EmploymentInfoClientView({id}:{id:string}){
  const router = useRouter();
  const { preApproval, isLoading, validateStepAccess} = usePreApprovalState(id);
  const { updateEmploymentInfo} = usePreApprovalStages(id);
  const [initialValues, setInitialValues] = useState<EmploymentInfoType | null>(null);


  useEffect(() => {
    if (!isLoading && preApproval) {
      const canAccess = validateStepAccess(2);
      
      if (canAccess) {
        setInitialValues({
          employment_status: preApproval.employment_info?.employment_status || "",
          employer_name: preApproval.employment_info?.employer_name || "",
          job_title: preApproval.employment_info?.job_title || "",
          current_job_years: preApproval.employment_info?.current_job_years || "",
          employment_type: preApproval.employment_info?.employment_type || "",
          gross_income: preApproval.employment_info?.gross_income || "",
          other_income: preApproval.employment_info?.other_income || "",
          income_frequency: preApproval.employment_info?.income_frequency || "",
          business_type: preApproval.employment_info?.business_type || "",
          incorporation_years:preApproval.employment_info?.incorporation_years || ""
        });
      }
    }
  }, [isLoading, preApproval]);

  const handleSubmit = async (values: EmploymentInfoType) => {
    await updateEmploymentInfo({
      employment_info: values,
      current_step: 3,
      completed_steps: Math.max(preApproval?.completed_steps || 1, 1, 1)
    });
  };
 
  const handleCancel = () => {
    router.push(`/user-dashboard/applications/${id}/pre-approval/personal-info`);
  };

  if (isLoading || !initialValues) {
    return <Skeleton className="h-96 w-full" />;
  }


  return(
    <div>
      <EmploymentInfoForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  )
}