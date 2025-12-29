import Form from "@/components/form/Form";
import { DocumentUploadFields } from "@/data/pages/dashboard/approval";
import { DocumentInfoType} from "@/type/pages/dashboard/approval";


export default function DocumentUploadForm({initialValues, handleSubmit, handleCancel,}:{
  initialValues:DocumentInfoType;
  handleSubmit:(values: DocumentInfoType) => Promise<void> | void;
  handleCancel:()=> void;

}){
  
  const validate = (values:DocumentInfoType)=>{
    const errors: Partial<Record<keyof DocumentInfoType, string>> = {};

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