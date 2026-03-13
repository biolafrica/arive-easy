import { NewsletterValues } from "@/type/newsletter";

export const validateNewsletter = (values: NewsletterValues) => {
  const errors: Partial<Record<keyof NewsletterValues, string>> = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email';
  }

  return errors;
};