import { ApplicationBase } from "@/type/pages/dashboard/application";
import { EmploymentInformationSection } from "../common/ApplicationDescriptionList";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export interface EmploymentInfoType {
  employment_status:string;
  employer_name:string;
  job_title:string;
  current_job_years:string;
  employment_type:string;
  gross_income:string;
  other_income?:string;
  income_frequency:string;
  business_type?:string;
  incorporation_years?:string;
};

export default function EmploymentInfoStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){
  return(
    <div>
      <EmploymentInformationSection data={stageData} />
    </div>
  )
}