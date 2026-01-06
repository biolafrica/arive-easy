'use client'

import Form from "@/components/form/Form";
import { buyerUserFields } from "@/data/pages/dashboard/users";
import { useCurrentUsers, useUpdateProfile } from "@/hooks/useSpecialized";
import { UserAvatarForm, UserProfileUserForm } from "@/type/user"

export default function UserForm (){
  const {data} = useCurrentUsers()
  const updateProfile = useUpdateProfile();

  const initialValues:UserProfileUserForm = {
    avatar: data?.avatar || "", 
    name: data?.name || "",
    email: data?.email || "",
    phone_number: data?.phone_number || "",
    residence_country: data?.residence_country || "",
  }

  const validateUser = (values:UserProfileUserForm)=>{
    const errors: Partial<Record<keyof UserProfileUserForm, string>> = {};

    if (values.phone_number.length < 11 || values.phone_number.length > 11) {
      errors.phone_number = 'Phone number must be 11 characters';
    } 

    return errors
  }

  const handleSubmitUser = async(values: UserProfileUserForm & { avatarFile?: File }) => {
    
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