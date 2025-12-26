import Form from "@/components/form/Form";
import { employmentInfoFields } from "@/data/pages/dashboard/approval";
import { EmploymentInfoType, employmentInfoInitialValues } from "@/type/pages/dashboard/approval";


export default function EmploymentInfoForm(){
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
  
  const handleSubmit = (values:EmploymentInfoType)=>{
    console.log(values)
  }

  const handleCancel =()=>{
    console.log('taye')
  }

  return(
    <div>
      <Form
        fields={employmentInfoFields}
        initialValues={employmentInfoInitialValues}
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