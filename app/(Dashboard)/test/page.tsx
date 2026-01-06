"use client"

import Form from "@/components/form/Form";
import { DocumentInfoFields } from "@/data/pages/dashboard/approval";
import { DocumentInfoTypes, documentInfoInitialValues } from "@/type/pages/dashboard/approval";

export default function Test(){
  const validate = (values:DocumentInfoTypes)=>{
    const errors: Partial<Record<keyof DocumentInfoTypes, string>> = {};
    return errors
  }

  const  handleSubmit = (values:DocumentInfoTypes) => {
    console.log("Submitted values:", values);
  }

  const handleCancel = () => {
    console.log("Form cancelled");
  }
 
  return(
    <div className="max-w-7xl mx-auto p-10">
      <Form
        fields={DocumentInfoFields}
        initialValues={documentInfoInitialValues}
        validate={validate}
        onSubmit={handleSubmit}
        submitLabel= "Save"
        cancelLabel= "Back"
        onCancel={handleCancel}
        fullWidthSubmit={false}
        showCancel={true}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0"  
      />
    </div>
  )
}