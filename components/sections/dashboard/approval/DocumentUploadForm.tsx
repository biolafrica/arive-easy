import Form from "@/components/form/Form";
import { DocumentUploadFields } from "@/data/pages/dashboard/approval";
import { DocumentInfoFormData,} from "@/type/pages/dashboard/approval";


export default function DocumentUploadForm({initialValues, handleSubmit, handleCancel,}:{
  initialValues:DocumentInfoFormData;
  handleSubmit:(values: DocumentInfoFormData) => Promise<void> | void;
  handleCancel:()=> void;

}){
  
  const validate = (values:DocumentInfoFormData)=>{
    const errors: Partial<Record<keyof DocumentInfoFormData, string>> = {};

    return errors

  }
  

  return(
    <div>      
      <Form
        fields={DocumentUploadFields}
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