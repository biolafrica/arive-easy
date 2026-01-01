import { DescriptionList } from "@/components/common/DescriptionList";
import { formatCurrency } from "@/lib/formatter";
import { ApplicationBase } from "@/type/pages/dashboard/application";

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
      <DescriptionList
        title="Employment Information"
        subtitle="Your Employement Details and information"
        items={[
          { label: 'Employment Status', value: { type: 'text', value: stageData.employment_status}},
          { label: 'Employer Name', value: { type: 'text', value: stageData.employer_name}},
          { label: 'Job Title', value: { type: 'text', value: stageData.job_title}},
          { label: 'Current Job Years', value: { type: 'text', value: stageData.current_job_years}},
          { label: 'Employment Type', value: { type: 'text', value: stageData.employment_type }},
          { label: 'Gross Income', value: { type: 'text', value: formatCurrency(stageData.gross_income)}},
          { label: 'Other Income', value: { type: 'text', value: formatCurrency(stageData.other_income) || "--:--"}},
          { label: 'Income Frequency', value: { type: 'text', value: stageData.income_frequency }},
          { label: 'Business Type', value: { type: 'text', value: stageData.business_type || "--:--"}},
          { label: 'Incorporation Years', value: { type: 'text', value: stageData.incorporation_years || "--:--"}},
        ]}
      />
    </div>
  )
}