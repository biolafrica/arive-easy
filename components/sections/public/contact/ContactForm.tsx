'use client';

import { useState } from 'react';
import Form from "@/components/form/Form";
import { CONTACT_FORM_FIELDS } from "@/data/contactForm";
import { CheckCircleIcon, ClockIcon} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  terms: boolean;
}

interface SuccessData {
  ticketId: string;
  email: string;
  name: string;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
    terms: false,
  };

  const validateContact = (values: ContactFormValues) => {
    const errors: Partial<Record<keyof ContactFormValues, string>> = {};
    
    if (!values.name || values.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!values.subject || values.subject.length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!values.message || values.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    if (!values.terms) {
      errors.terms = 'You must accept the terms';
    }
    
    return errors;
  };

  const handleSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccessData({ ticketId: data.ticketId, email: values.email, name: values.name});

      toast.success('Message sent successfully!', {
        description: 'We will get back to you shortly.'
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.', {
        description:"Please try again."
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-heading mb-2">
              Thank you for contacting us!
            </h2>
            
            <p className="text-secondary text-lg">
              We've received your support request
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-4">
              Your Request Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-700 font-medium min-w-[100px]">Ticket ID:</span>
                <span className="font-mono text-blue-900 bg-white px-3 py-1 rounded border border-blue-200">
                  {successData.ticketId}
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-700 font-medium min-w-[100px]">Email:</span>
                <span className="text-blue-900">{successData.email}</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-700 font-medium min-w-[100px]">Response:</span>
                <span className="text-blue-900">Within 24-48 hours</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-heading mb-4 flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              What happens next?
            </h3>
            
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Our support team will review your request</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>You'll receive a confirmation email at <strong>{successData.email}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>We'll respond with a solution within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Keep your ticket ID for reference: <strong>{successData.ticketId}</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Please check your spam folder if you don't receive our confirmation email within a few minutes.
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div >
      <Form<ContactFormValues>
        fields={CONTACT_FORM_FIELDS}
        initialValues={initialValues}
        validate={validateContact}
        onSubmit={handleSubmit}
        submitLabel={isSubmitting ? "Sending..." : "Send Message"}
      />
    </div>
  );
}


