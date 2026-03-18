'use client'

import PersonalInfoForm from "@/components/sections/dashboard/approval/PersonalInfoForm"

export default function Test(){
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    residence_country: "",
    marital_status: "",
    dependant: "",
    visa_status: "",
    state: "",
    street: "",
    street2: "",
    city: "",
    postal_code:"",
    country:"",
        
  }
  const handleSubmit =()=>{}
  const handleCancel =()=>{}
  return(
    <div>
      <h4>
        Test page
      <PersonalInfoForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      </h4>
     
    </div>
  )
}



