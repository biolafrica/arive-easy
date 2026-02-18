import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { dynamicDocumentField, dynamicDocumentInitialValue} from "@/data/pages/dashboard/documents";
import { DynamicDocumentForm } from "@/type/pages/dashboard/documents";

export default function AddDocuments({showModal, setShowModal, id}:{
  showModal:boolean
  setShowModal:(value:boolean)=>void
  id:string
}){

  const handleCreateDocument = async (values:DynamicDocumentForm) => {
   console.log(values)
  };

  const validate =(values:DynamicDocumentForm)=>{
    const errors: Partial<Record<keyof DynamicDocumentForm, string>>={}
    return errors
  }
  
  return(
    <div>
      <Modal
        onClose={()=>setShowModal(false)}
        isOpen={showModal}
        title="Add Documents"
      >
        <Form
          fields={dynamicDocumentField}
          initialValues={dynamicDocumentInitialValue}
          validate={validate}
          onSubmit={handleCreateDocument}
          submitLabel="Generate Document"
        />
        
      </Modal>
    </div>
  )
}