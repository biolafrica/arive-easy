'use client'

import Form from "@/components/form/Form";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { sellerUserFields } from "@/data/pages/dashboard/users";
import { SellerProfileUserForm,} from "@/type/user"

export default function SellerUserForm (){

  const initialValues:SellerProfileUserForm = {
    avatar: "",
    name: "",
    email: "",
    phone_number: "",
    address : "",
    bio: ""
   
  }

  const validateUser = (values:SellerProfileUserForm)=>{
    const errors: Partial<Record<keyof SellerProfileUserForm, string>> = {};

    if (values.phone_number.length < 11) {
      errors.phone_number = 'Password must be at least 8 characters';
    } 

    if (values.bio.length < 200) {
      errors.bio = 'Bio must be at least 200 characters';
    } 

    return errors
  }

  const handleSubmitUser = (values:SellerProfileUserForm)=>{
    console.log(values)
  }
  return(
    <PageContainer>
      <Form
        fields={sellerUserFields}
        initialValues={initialValues}
        validate={validateUser}
        onSubmit={handleSubmitUser}
        submitLabel= "Save Profile"
      />
    </PageContainer>
  )

}