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
  return (
    <Form<ContactFormValues>
      fields={CONTACT_FORM_FIELDS}
      initialValues={{
        name: '',
        email: '',
        subject: '',
        message: '',
        terms: false,
      }}

      validate={(values) => {
        const errors: Partial<Record<keyof ContactFormValues, string>> = {};

        if (!values.terms) {
          errors.terms = 'You must accept the terms';
        }

        return errors;
      }}
      onSubmit={async (values) => {
        console.log('Contact form submitted', values);
      }}

      submitLabel="Send Message"
    />
  );
}
