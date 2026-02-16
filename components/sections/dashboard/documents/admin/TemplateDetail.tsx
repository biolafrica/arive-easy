import { useUploadTemplateDocuments } from "@/hooks/useSpecialized/useDocuments";
import { useRouter } from "next/navigation";
import { TemplateForm } from "@/type/pages/dashboard/documents";
import { TemplateFormComponent } from "../common/TemplateForm";

export default function TemplateDetail({close}:{
  close: ()=>void
}) {


  const router = useRouter();
  const { uploadDocument, isUploading } = useUploadTemplateDocuments();

  const handleSubmit = async (values: TemplateForm) => {
    try {
      console.log("Submitting template values:", values);
      
      const result = await uploadDocument(values);
      
      if (result) {
        console.log("Template created successfully:", result);
        setTimeout(()=>{
          close()
        }, 1500)
      }
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  return (
    <div className="p-4">
      <TemplateFormComponent
        onSubmit={async (values) => {
          handleSubmit(values);
        }}
        onCancel={() => close()}
        submitLabel={isUploading ? "Creating..." : "Create Template"}
      />
    </div>
  );
}