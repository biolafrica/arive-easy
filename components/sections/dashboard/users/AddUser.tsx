import Form from "@/components/form/Form"
import { userFields, userInitialValues } from "@/data/pages/dashboard/users"
import { useUserRegistration } from "@/hooks/useSpecialized/useUser"
import { UserForm } from "@/type/user"
import generateTempPassword from "@/utils/common/generatePassword"
import { useState } from "react"
import { ErrorDisplay } from "../../auth/TabHeader"

export default function AddUser({close}:{
  close: ()=>void
}){
  const [error, setError] = useState<string>('')
  const create = useUserRegistration(true)

  const handleSubmit = async(values:UserForm)=>{
    setError('');

    const password = generateTempPassword()
    const formData = {
      name : values.name,
      email: values.email,
      password,
      role: values.role
    }

    try {
      await create(formData)
      setTimeout(() => close(), 1500)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Signup Error, please try again.")
    }
  }

  const handleValidate =(values:UserForm)=>{
    const errors: Partial<Record<keyof UserForm, string>>={}
    return errors
  }

  return(
    <div className="space-y-4">

      {error && (
        <ErrorDisplay error={error}/>
      )}

      <Form
        fields={userFields}
        initialValues={userInitialValues}
        validate={handleValidate}
        onSubmit={handleSubmit}
        submitLabel="Create User"
      />
    </div>
  )
}