import Form from "@/components/form/Form";
import { personalInfoFields } from "@/data/pages/dashboard/approval";
import { PersonalInfoType, personalInfoInitialValues } from "@/type/pages/dashboard/approval";

export default function PersonalInfoForm(){

  const validate = (values:PersonalInfoType)=>{
    const errors: Partial<Record<keyof PersonalInfoType, string>> = {};

    if (values.phone_number.length < 11) {
      errors.phone_number = 'Password must be at least 8 characters';
    } 

    if (values.date_of_birth) {
      const dob = new Date(values.date_of_birth);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 18) {
        errors.date_of_birth = 'You must be at least 18 years old';
      }
    }

    return errors

  }

  const handleSubmit = (values:PersonalInfoType)=>{
    console.log(values)
  }

  const handleCancel =()=>{
    console.log('taye')
  }

  return(
    <div>
      <Form
        fields={personalInfoFields}
        initialValues={personalInfoInitialValues}
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