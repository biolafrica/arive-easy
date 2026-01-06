import Form from "@/components/form/Form";
import { DocumentInfoFields } from "@/data/pages/dashboard/approval";
import { DocumentInfoTypes } from "@/type/pages/dashboard/approval";


export default function DocumentUploadForm({initialValues, handleSubmit, handleCancel}:{
  initialValues:DocumentInfoTypes
  handleSubmit:(values: DocumentInfoTypes) => Promise<void> | void;
  handleCancel:()=> void;
}){
  
  const validate = (values:DocumentInfoTypes)=>{
    const errors: Partial<Record<keyof DocumentInfoTypes, string>> = {};
    return errors
  }
  

  return(
    <div>      
      <Form
        fields={DocumentInfoFields}
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        submitLabel= "Save"
        cancelLabel= "Back"
        onCancel={handleCancel}
        fullWidthSubmit={false}
        showCancel={true}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0"  
      />
    </div>

  )
}
