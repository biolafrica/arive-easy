import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { Button } from "@/components/primitives/Button";
import { legalField, legalInitialValue, valuationField, valuationInitialValue } from "@/data/pages/dashboard/application";
import { useUpdateApplication } from "@/hooks/useSpecialized/useApplications";
import { AddLegalForm, AddValuationForm, AdminApplicationModalProps } from "@/type/pages/dashboard/application";
import { useState } from "react";
import { set } from "zod";

export default function AddPayment(
  {showModal, setShowModal, id}:AdminApplicationModalProps)
{

  const [actionType, setActionType]=useState<'valuation' |'legal' | null>(null)
  const { updateApplication} = useUpdateApplication()

  const handleActionClick = (type: 'valuation' | 'legal') => {
    setActionType(type);
  };

  const width = actionType ? "2xl" :"sm"

  const validateValuation =(values:AddValuationForm)=>{
    const errors: Partial<Record<keyof AddValuationForm, string>>={}
    return errors
  }

  const validateLegal =(values:AddLegalForm)=>{
    const errors: Partial<Record<keyof AddLegalForm, string>>={}
    return errors
  }

  const handleLegalSubmit = async(values:AddLegalForm)=>{
    await updateApplication(id, values, {successMessage: 'Legal fee added successfully'})
    setShowModal(false);
  }

  const handleValuationSubmit = async(values:AddValuationForm)=>{
    await updateApplication(id, values, {successMessage: 'Valuation fee added successfully'})
    setShowModal(false);
  }

  return(
    <div>
      <Modal
        onClose={()=>{
          setShowModal(false);
          setActionType(null)
        }}
        isOpen={showModal}
        title="Add Payment"
        maxWidth={width}

      >
        {actionType === "valuation" ? 
          (
            <Form
              fields={valuationField}
              initialValues={valuationInitialValue}
              validate={validateValuation}
              onSubmit={handleValuationSubmit}
              submitLabel="Add Valuation Fee"
            />
            
          ) : actionType === "legal" ?
          (
            <Form
              fields={legalField}
              initialValues={legalInitialValue}
              validate={validateLegal}
              onSubmit={handleLegalSubmit}
              submitLabel="Add Legal fee"
            />
          ):
          (
            <div>
              <div className="flex flex-col">
                <Button
                  variant="outline"
                  className="flex-1 border-none"
                  onClick={() => handleActionClick('valuation')}
                >
                  Valuation Fee
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-none"
                  onClick={() => handleActionClick('legal')}
                >
                  Legal Fee
                </Button>
              </div>
            </div>
          ) 
        }
      </Modal>
    </div>
  )
}