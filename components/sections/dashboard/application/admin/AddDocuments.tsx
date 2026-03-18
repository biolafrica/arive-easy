import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { dynamicDocumentField, dynamicDocumentInitialValue} from "@/data/pages/dashboard/documents";
import { useTransactionalDocument} from "@/hooks/useSpecialized/useDocuments";
import { AdminApplicationModalProps } from "@/type/pages/dashboard/application";
import { DynamicDocumentForm } from "@/type/pages/dashboard/documents";

export default function AddDocuments({showModal, setShowModal, id, close}:AdminApplicationModalProps){
  const { generateContractDocument, isGenerating } = useTransactionalDocument();

  const handleCreateDocument = async (values:DynamicDocumentForm) => {
    try {
      const result = await generateContractDocument({
        applicationId: id,
        documentType: values.document_type,
      });

      if (result?.success) {
        setShowModal(false);
        setTimeout(()=>{
          close()
        },1500)
      }
    } catch (error) {
      console.error('Error creating document:', error);
    }
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
          submitLabel={isGenerating ? 'Generating Document...' : 'Generate & Send for Signature'}

        />
        
      </Modal>
    </div>
  )
}