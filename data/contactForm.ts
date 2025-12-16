import { FormField } from "@/type/form";

export const CONTACT_FORM_FIELDS: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter full name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email',
    required: true,
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'text',
    placeholder: 'How can we help?',
    required: true,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell us more about your question or concern...',
    rows: 6,
    required: true,
  },
  {
    name: 'terms',
    label: 'I accept the Terms',
    type: 'checkbox',
    required: true,
  },
];
