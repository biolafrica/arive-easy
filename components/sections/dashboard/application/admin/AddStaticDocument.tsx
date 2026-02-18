import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { staticDocumentField, staticDocumentInitialValue } from "@/data/pages/dashboard/documents";
import { StaticDocumentForm } from "@/type/pages/dashboard/documents";

export default function AddStaticDocuments({showModal, setShowModal, id}:{
  showModal:boolean
  setShowModal:(value:boolean)=>void
  id:string
}){

  const handleSubmit = async (values:StaticDocumentForm) => {
   console.log(values)
  };

  const validate =(values:StaticDocumentForm)=>{
    const errors: Partial<Record<keyof StaticDocumentForm, string>>={}
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
          fields={staticDocumentField}
          initialValues={staticDocumentInitialValue}
          validate={validate}
          onSubmit={handleSubmit}
          submitLabel="Upload Document"
        />
        
      </Modal>
    </div>
  )
}