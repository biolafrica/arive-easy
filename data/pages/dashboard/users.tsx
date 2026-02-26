import { TableColumn } from "@/components/common/DataTable";
import { formatDate } from "@/lib/formatter";
import { FormField } from "@/type/form";
import { UserBase } from "@/type/user";

export const buyerUserFields:FormField[] = [
  { name: 'avatar', label: 'Photo', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: "1:1", helperText: 'Recommended size: 1MB max', },
  { name: 'name', label: 'Name', type: 'text', placeholder: 'name', required: true},
  { name: 'email', label: 'Email Address', type: 'email', placeholder: "email", required: true ,disabled:true },
  { name: 'phone_number', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number', required: false },
  { name: 'residence_country', label: 'Country of Residence', type: 'select', required: false,
    options: [
      { label: 'Select country', value: '' },
      { label: 'Nigeria', value: 'nigeria' },
      { label: 'Canada', value: 'canada' },
    ],
  },

]

export const sellerUserFields:FormField[] = [
  { name: 'avatar', label: 'Avatar', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: "1:1", helperText: 'Recommended size: 1MB max' },
  { name: 'name', label: 'Name', type: 'text', placeholder: 'name', required: true},
  { name: 'email', label: 'Email Address', type: 'email', placeholder: "email", required: true ,disabled:true },
  { name: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number', required: false },
  { name: 'address', label: 'Address', type: 'textarea', placeholder: '123 Seller St, City, Country', required: false },
  { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Experienced property seller specializing in luxury real estate.', required: false },
  

]

export const passwordFields:FormField[] = [
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Old password', required: true },
  { name: 'new_password', label: 'New Password', type: 'password', placeholder: 'New password', required: true },
  { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: 'Confirm password', required: true },
]

export const columns:TableColumn<UserBase>[]=[
  { key: 'created_at', header: 'Date Created', sortable: false, accessor: (row) => formatDate(row.created_at)},
  { key: 'name', header: 'Name', sortable: false},
  { key: 'role', header: 'Role', sortable: false},
  { key: 'email', header: 'Email', sortable: false},
]