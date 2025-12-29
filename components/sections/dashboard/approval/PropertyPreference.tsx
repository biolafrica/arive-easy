import Form from "@/components/form/Form";
import { propertyPreferenceFields } from "@/data/pages/dashboard/approval";
import {  PropertyPreferenceType} from "@/type/pages/dashboard/approval";


export default function PropertyPreferenceForm({initialValues, handleSubmit, handleCancel,}:{
  initialValues:PropertyPreferenceType;
  handleSubmit:(values: PropertyPreferenceType) => Promise<void> | void;
  handleCancel:()=> void;

}){
  const validate = (values:PropertyPreferenceType)=>{
    const errors: Partial<Record<keyof PropertyPreferenceType, string>> = {};

    return errors

  }

  return(
    <div>
      <Form
        fields={propertyPreferenceFields}
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