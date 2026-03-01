import { DescriptionList } from "@/components/common/DescriptionList"
import { formatDate } from "@/lib/formatter"
import { UserBase } from "@/type/user"

export default function UserDetails({user}:{
  user:UserBase
}){
  return(
    <div>
      <DescriptionList
        title={`${user.name} Details`}
        subtitle='More information about user'
        items={[
          { label: 'User ID', value: { type: 'text', value:user.id}},
          { label: 'Date Registered', value: { type: 'text', value:formatDate(user.created_at)}},
          { label: 'User Name', value: { type: 'text', value: user.name}},
          { label: 'Email', value: { type: 'text', value:user.email}},
          { label: 'Phone Number', value: { type: 'text', value: user.phone_number || "No phone added"}},
        ]}
      />

    </div>
  )
}