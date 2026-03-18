'use client'

import DocumentUploadForm from "@/components/sections/dashboard/approval/DocumentUploadForm"

export default function Test(){
  const initialValues = {
    pay_stubs: '',
    tax_returns: '',
    bank_statements:'',
    employment_verification: '',
   
  }

  const handleSubmit =()=>{}
  const handleCancel =()=>{}
  return(
    <div>
      <h4>
        <DocumentUploadForm
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          initialValues={initialValues} 
        />
      </h4>
     
    </div>
  )
}



