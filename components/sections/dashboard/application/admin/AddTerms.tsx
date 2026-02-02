import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { termField, termInitialValue } from "@/data/pages/dashboard/application";
import { useUpdateApplication } from "@/hooks/useSpecialized/useApplications";
import { AddTermsForm, AdminApplicationModalProps } from "@/type/pages/dashboard/application";

export default function AddTerms(
  {showModal, setShowModal, id}:AdminApplicationModalProps)
{

  const { updateApplication} = useUpdateApplication()

  const validate =(values:AddTermsForm)=>{
    const errors: Partial<Record<keyof AddTermsForm, string>>={}
    return errors
  }

  const handleSubmit = async(values:AddTermsForm)=>{
    await updateApplication(id, values, {successMessage: 'Loan Terms added successfully'})
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