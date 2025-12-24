'use client';

import Form from "@/components/form/Form";
import { CONTACT_FORM_FIELDS } from "@/data/contactForm";


interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  terms: boolean;
}

export function ContactForm() {

  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
    terms: false,
  }

  const validateContact = (values: ContactFormValues ) => {
    const errors: Partial<Record<keyof ContactFormValues, string>> = {};
    
    if(!values.terms) {
      errors.terms = 'You must accept the terms';
    }
    
    return errors;
  };

  const handleSumbit = async(values:ContactFormValues)=>{
    console.log('Contact form submitted', values);

  }

  return (

    <Form<ContactFormValues>
      fields={CONTACT_FORM_FIELDS}
      initialValues={initialValues}
      validate={validateContact}
      onSubmit={handleSumbit}
      submitLabel="Send Message"
    />
  );
}
