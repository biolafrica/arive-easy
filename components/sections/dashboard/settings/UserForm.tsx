'use client'

import Form from "@/components/form/Form";
import { buyerUserFields } from "@/data/pages/dashboard/users";
import { UserProfileUserForm } from "@/type/user"

export default function UserForm (){
  const initialValues:UserProfileUserForm = {
    avatar: "",
    name: "",
    email: "",
    phone_number: "",
    residence_country: ""
  }

  const validateUser = (values:UserProfileUserForm)=>{
    const errors: Partial<Record<keyof UserProfileUserForm, string>> = {};

    if (values.phone_number.length < 11) {
      errors.phone_number = 'Password must be at least 8 characters';
    } 

    return errors
  }

  const handleSubmitUser = (values:UserProfileUserForm)=>{
    console.log(values)
  }

  return(
    <div>

      <Form
        fields={buyerUserFields}
        initialValues={initialValues}
        validate={validateUser}
        onSubmit={handleSubmitUser}
        submitLabel= "Save Profile"
      />

    </div>
  )

}