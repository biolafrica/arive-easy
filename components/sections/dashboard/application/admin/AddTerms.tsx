import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { termField, termInitialValue } from "@/data/pages/dashboard/application";
import { AddTermsForm } from "@/type/pages/dashboard/application";

export default function AddTerms({showModal, setShowModal}:{
  showModal:boolean
  setShowModal:(value:boolean)=>void
}){

  const validate =(values:AddTermsForm)=>{
    const errors: Partial<Record<keyof AddTermsForm, string>>={}
    return errors
  }
  const handleSubmit=()=>{
    console.log('submit')
  }

  return(
    <div>
       <Modal
        onClose={()=>setShowModal(false)}
        isOpen={showModal}
        title="Add Terms"
      >
        <Form
          fields={termField}
          initialValues={termInitialValue}
          validate={validate}
          onSubmit={handleSubmit}
          submitLabel="Add Terms"
        />

      </Modal>
    </div>
  )
}