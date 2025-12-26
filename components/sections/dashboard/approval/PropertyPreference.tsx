import Form from "@/components/form/Form";
import { propertyPreferenceFields } from "@/data/pages/dashboard/approval";
import {  PropertyPreferenceType, propertyPreferenceInitialValues} from "@/type/pages/dashboard/approval";


export default function PropertyPreferenceForm(){
  const validate = (values:PropertyPreferenceType)=>{
    const errors: Partial<Record<keyof PropertyPreferenceType, string>> = {};

    return errors

  }
  
  const handleSubmit = (values:PropertyPreferenceType)=>{
    console.log(values)
  }

  const handleCancel =()=>{
    console.log('taye')
  }

  return(
    <div>
      <Form
        fields={propertyPreferenceFields}
        initialValues={propertyPreferenceInitialValues}
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