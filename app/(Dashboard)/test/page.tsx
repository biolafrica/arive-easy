"use client"

import DocumentUploadForm from "@/components/sections/dashboard/approval/DocumentUploadForm"
import { DocumentInfoTypes } from "@/type/pages/dashboard/approval"
import { useState } from "react"


export default function Test(){
  const handleSubmit=()=>{
    console.log("")
  }

  const handleCancel=()=>{
    console.log("")
  }

  const initialValues ={ 
    pay_stubs:  '',
    tax_returns:  '',
    bank_statements:  '',
    employment_verification:  '',
  }

  return(
    <div className="max-w-7xl mx-auto p-10">
      <h4 className="text-2xl font-bold mb-6">Test Page</h4>
      <DocumentUploadForm 
        handleCancel={handleCancel} 
        handleSubmit={handleSubmit} 
        initialValues={initialValues}
      />
    </div>
  )
}