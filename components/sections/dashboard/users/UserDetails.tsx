import { DescriptionList } from "@/components/common/DescriptionList"
import { formatDate } from "@/lib/formatter"
import { UserBase } from "@/type/user"
import Image from "next/image"

export default function UserDetails({user}:{
  user:UserBase
}){

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return(
    <div className="space-y-6">

      <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-gray-50 flex items-center justify-center">
        {user.avatar ? (
          <Image
            src={`${user.avatar}`}
            alt={user.name ?? "User avatar"}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full bg-orange-100 text-lg font-semibold text-orange-700">
            {initials}
          </span>
        )}
      </div>

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