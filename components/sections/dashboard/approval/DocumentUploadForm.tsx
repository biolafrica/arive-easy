import Form from "@/components/form/Form";
import { DocumentUploadFields } from "@/data/pages/dashboard/approval";
import { DocumentUploadType, documentUploadInitialValues} from "@/type/pages/dashboard/approval";


export default function DocumentUploadForm(){
  
  const validate = (values:DocumentUploadType)=>{
    const errors: Partial<Record<keyof DocumentUploadType, string>> = {};

    return errors

  }
  
  const handleSubmit = (values:DocumentUploadType)=>{
    console.log(values)
  }
  
  const handleCancel =()=>{
    console.log('taye')
  }

  return(
    <div>      
      <Form
        fields={DocumentUploadFields}
        initialValues={documentUploadInitialValues}
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