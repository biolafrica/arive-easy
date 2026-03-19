import Form from "@/components/form/Form"
import { userFields, userInitialValues } from "@/data/pages/dashboard/users"
import { UserForm } from "@/type/user"

export default function AddUser({close}:{
  close: ()=>void
}){

  const handleSubmit =(values:UserForm)=>{}

  const handleValidate =(values:UserForm)=>{
    const errors: Partial<Record<keyof UserForm, string>>={}
    return errors
  }

  return(
    <div>
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