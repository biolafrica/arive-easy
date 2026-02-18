import Modal from "@/components/common/ContentModal";
import Form from "@/components/form/Form";
import { dynamicDocumentField, dynamicDocumentInitialValue} from "@/data/pages/dashboard/documents";
import { useTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments";
import { DynamicDocumentForm } from "@/type/pages/dashboard/documents";

export default function AddDocuments({showModal, setShowModal, id}:{
  showModal:boolean
  setShowModal:(value:boolean)=>void
  id:string
}){
  const { generateContractDocument, isGenerating } = useTransactionalDocuments();

  const handleCreateDocument = async (values:DynamicDocumentForm) => {
   console.log(values)
    try {
      const result = await generateContractDocument({
        applicationId: id,
        documentType: values.document_type,
      });

      if (result?.success) {
        console.log('Signing URLs:', result);
        setShowModal(false);
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