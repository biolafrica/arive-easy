import TemplateForm, { TemplateFormData } from "../common/TemplateForm";
import { useRouter } from "next/navigation";

export default function TemplateDetail() {
  const router = useRouter();
  const handleSubmit = (values: TemplateFormData) => {
    console.log("submitted values", values)
  }

  return (
    <div className="p-4">
      <TemplateForm
        onSubmit={async (values) => {
          handleSubmit(values);
        }}
        onCancel={() => router.back()}
        submitLabel="Create Template"
      />
    </div>
  );
}