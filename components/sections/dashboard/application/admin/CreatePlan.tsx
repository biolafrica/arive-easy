import Modal from "@/components/common/ContentModal"
import Form from "@/components/form/Form"
import { planField, planInitialValue } from "@/data/pages/dashboard/application"
import { useUpdateApplication } from "@/hooks/useSpecialized/useApplications"
import { AddPlan, AdminApplicationModalProps } from "@/type/pages/dashboard/application"


export default function CreatePlan(
  {showModal, setShowModal, id}:AdminApplicationModalProps)
{

  const { updateApplication} = useUpdateApplication()

  const validate =(values:AddPlan)=>{
    const errors: Partial<Record<keyof AddPlan, string>>={}
    return errors
  }

  const handleSubmit = async(values:AddPlan)=>{
    await updateApplication(id, values, {successMessage: 'Plan created succesfully'})
    setShowModal(false);
  }

  return(
    <div>
      <Modal
        onClose={()=>setShowModal(false)}
        isOpen={showModal}
        title="Create Payment Plan"
      >
        <Form
          fields={planField}
          initialValues={planInitialValue}
          validate={validate}
          onSubmit={handleSubmit}
          submitLabel="Create Plan"
        />

      </Modal>
      

    </div>
  )
}