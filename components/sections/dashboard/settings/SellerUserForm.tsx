'use client'

import Form from "@/components/form/Form";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { sellerUserFields } from "@/data/pages/dashboard/users";
import { useCurrentUsers, useUpdateProfile } from "@/hooks/useSpecialized/useUser";
import { SellerProfileUserForm, UserAvatarForm,} from "@/type/user"

export default function SellerUserForm (){
  const {data} = useCurrentUsers()
  const updateProfile = useUpdateProfile();

  const initialValues:SellerProfileUserForm = {
    avatar: data?.avatar || "",
    name: data?.name || "",
    email: data?.email || "",
    phone_number: data?.phone_number || "",
    address: data?.address || "",
    bio: data?.bio || "",
   
  }

  const validateUser = (values:SellerProfileUserForm)=>{
    const errors: Partial<Record<keyof SellerProfileUserForm, string>> = {};

    if(values.bio){
      if (values.bio.length > 200) {
        errors.bio = 'Bio must be less than 200 characters';
      }
    }
    
    return errors
  }

  const handleSubmitUser = async(values:SellerProfileUserForm)=>{
    const { avatar, ...otherData } = values;
    
    const updateData: UserAvatarForm = {
      ...otherData,
    };
    
    if (typeof avatar === 'string') {
      updateData.avatar = avatar;
    } else if (avatar instanceof File) {
      updateData.avatarFile = avatar;
    }
    
    await updateProfile.mutateAsync(updateData);
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