import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { staticDocumentField, staticDocumentInitialValue } from "@/data/pages/dashboard/documents";
import { useUploadStaticDocuments } from "@/hooks/useSpecialized/useDocuments";
import { AdminApplicationModalProps } from "@/type/pages/dashboard/application";
import { StaticDocumentForm, StaticTransactionDocumentForm } from "@/type/pages/dashboard/documents";
import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";

export default function AddStaticDocuments({showModal, setShowModal, id}:AdminApplicationModalProps){

  const { uploadDocument, isUploading } = useUploadStaticDocuments();

  const handleSubmit = async (values:StaticDocumentForm) => {
    console.log(values)
    const transaction_document_number = generateApplicationRefNo('TRD')

    const formData:StaticTransactionDocumentForm ={
      application_id :id,
      transaction_document_number ,
      ...values,
    }

    try {
      const result = await uploadDocument(formData);
      if (result) {
        setShowModal(false)
        setTimeout(()=>{
          close()
        },1500)
      }
      
    } catch (error) {
      console.error("Failed to create static document:", error);
    }
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
          submitLabel={isUploading ? "Uploading..." : "Upload Document"}
        />
        
      </Modal>
    </div>
  )
}