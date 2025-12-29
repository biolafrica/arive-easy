import Form from "@/components/form/Form";
import { personalInfoFields } from "@/data/pages/dashboard/approval";
import { PersonalInfoType} from "@/type/pages/dashboard/approval";

export default function PersonalInfoForm({initialValues, handleSubmit, handleCancel,}:{
  initialValues:PersonalInfoType;
  handleSubmit:(values: PersonalInfoType) => Promise<void> | void;
  handleCancel:()=> void;

}){

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

  return(
    <div>
      <Form
        fields={personalInfoFields}
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