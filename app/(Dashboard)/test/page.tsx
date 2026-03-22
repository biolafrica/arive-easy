'use client'

import DocumentUploadForm from "@/components/sections/dashboard/approval/DocumentUploadForm"

export default function Test(){

  const initialValues ={
    pay_stubs:  '',
    tax_returns:'',
    bank_statements: '',
    employment_verification:  '',
  }
  const handleSubmit =()=>{
    console.log('taye')
  }
  const handleCancel =()=>{
    console.log('kehinde')
  }
  
  return(
    <div>
      <DocumentUploadForm initialValues={initialValues} handleCancel={handleCancel} handleSubmit={handleSubmit}/>
    </div>
  )
}



