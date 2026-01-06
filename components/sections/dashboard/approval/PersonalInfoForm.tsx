import Form from "@/components/form/Form";
import { personalInfoFields } from "@/data/pages/dashboard/approval";
import { PersonalInfoFormValues} from "@/type/pages/dashboard/approval";

export default function PersonalInfoForm({initialValues, handleSubmit, handleCancel,}:{
  initialValues:PersonalInfoFormValues;
  handleSubmit:(values: PersonalInfoFormValues) => Promise<void> | void;
  handleCancel:()=> void;

}){

  const CANADA_POSTAL_CODE_REGEX =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;


  const validate = (values:PersonalInfoFormValues)=>{
    const errors: Partial<Record<keyof PersonalInfoFormValues, string>> = {};

    if (values.phone_number.length < 11 || values.phone_number.length > 11) {
      errors.phone_number = 'Phone number must be 11 characters';
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