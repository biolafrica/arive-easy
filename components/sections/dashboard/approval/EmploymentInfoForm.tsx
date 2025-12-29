import Form from "@/components/form/Form";
import { employmentInfoFields } from "@/data/pages/dashboard/approval";
import { EmploymentInfoType} from "@/type/pages/dashboard/approval";


export default function EmploymentInfoForm({initialValues, handleSubmit, handleCancel}:{
  initialValues:EmploymentInfoType;
  handleSubmit:(values: EmploymentInfoType) => Promise<void> | void;
  handleCancel:()=> void;

}){

  const validate = (values:EmploymentInfoType)=>{
    const errors: Partial<Record<keyof EmploymentInfoType, string>> = {};

    if (values.employment_status === 'business_owner') {
      if (!values.business_type || values.business_type.trim() === '') {
        errors.business_type = 'Business type is required for business owners';
      }

      if (!values.incorporation_years) {
        errors.incorporation_years = 'Incorporation year is required for business owners';
      }
    }

    return errors


  }
  

  return(
    <div>
      <Form
        fields={employmentInfoFields}
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        submitLabel= "Save"
        cancelLabel= "Back"
        onCancel={handleCancel}
        fullWidthSubmit={false}
        showCancel={true}
      />
    </div>

  )
}