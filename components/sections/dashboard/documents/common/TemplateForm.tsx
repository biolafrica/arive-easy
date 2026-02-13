'use client';

import React, { useState } from 'react';
import { TemplateField } from '@/type/form';
import DynamicFieldBuilder from '@/components/form/Dynamicfieldbuilder';
import { Button } from '@/components/primitives/Button';

export interface TemplateFormData {
  name: string;
  description: string;
  type: string;
  category: string;
  requires_signatures: string[];
  version: number;
  template_file_url: File | null;
  template_fields: TemplateField[];
}

interface TemplateFormProps {
  initialValues?: Partial<TemplateFormData>;
  onSubmit: (values: TemplateFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isEdit?: boolean;
}

export function TemplateForm({ 
  initialValues = {}, 
  onSubmit, 
  onCancel,
  submitLabel = 'Create Template',
  isEdit = false 
}: TemplateFormProps) {
  const [values, setValues] = useState<TemplateFormData>({
    name: '',
    description: '',
    type: '',
    category: 'online_generated',
    requires_signatures: [],
    version: 1,
    template_file_url: null,
    template_fields: [],
    ...initialValues
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (name: keyof TemplateFormData, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleMultiSelect = (name: keyof TemplateFormData, value: string) => {
    const currentValues = (values[name] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    updateField(name, newValues);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.name.trim()) newErrors.name = 'Template name is required';
    if (!values.type) newErrors.type = 'Document type is required';
    if (!values.category) newErrors.category = 'Category is required';
    if (values.requires_signatures.length === 0) newErrors.requires_signatures = 'Select required signatures';
    if (!isEdit && !values.template_file_url) newErrors.template_file_url = 'PDF template is required';
    if (values.template_fields.length === 0) newErrors.template_fields = 'At least one template field is required';

    // Validate template fields
    const invalidFields = values.template_fields.filter(field => 
      !field.placeholder || !field.label || !field.field_key
    );
    if (invalidFields.length > 0) {
      newErrors.template_fields = 'All fields must have placeholder, label, and field key';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Template submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label: string, error: string, children: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium text-heading mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );

  const renderMultiSelect = (
    name: keyof TemplateFormData, 
    options: Array<{ label: string; value: string }>,
    error?: string
  ) => (
    <div className="space-y-2">
      {options.map(option => (
        <label key={option.value} className="flex items-center">
          <input
            type="checkbox"
            checked={(values[name] as string[])?.includes(option.value) || false}
            onChange={() => toggleMultiSelect(name, option.value)}
            className="mr-2 h-4 w-4 rounded border-border"
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template Name */}
        {renderField('Template Name *', errors.name, 
          <input
            type="text"
            value={values.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
            placeholder="Enter template name"
          />
        )}

        {/* Document Type */}
        {renderField('Document Type *', errors.type,
          <select
            value={values.type}
            onChange={(e) => updateField('type', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
          >
            <option value="">Select document type...</option>
            <option value="contract_of_sales">Contract of Sales</option>
            <option value="mortgage_agreement">Mortgage Agreement</option>
            <option value="certificate_of_occupancy">Certificate of Occupancy</option>
            <option value="title_deed">Title Deed</option>
          </select>
        )}

        {/* Category */}
        {renderField('Category *', errors.category,
          <select
            value={values.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
          >
            <option value="online_generated">Online Generated</option>
            <option value="scanned_upload">Scanned Upload</option>
          </select>
        )}

        {/* Version */}
        {renderField('Version', '',
          <input
            type="number"
            value={values.version}
            onChange={(e) => updateField('version', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg"
            min="1"
          />
        )}
      </div>

      {/* Description */}
      {renderField('Description', errors.description,
        <textarea
          value={values.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg"
          placeholder="Describe what this template is used for"
        />
      )}

      {/* Signature Requirements */}
      <div>
        <h4 className="text-sm font-medium text-heading mb-2">Signatures Required *</h4>
        {renderMultiSelect('requires_signatures', [
          { label: 'Buyer', value: 'buyer' },
          { label: 'Seller', value: 'seller' },
          { label: 'Bank', value: 'bank' },
          { label: 'Witness', value: 'witness' },
        ], errors.requires_signatures)}
      </div>

      {/* PDF Upload */}
      {!isEdit && renderField('Template PDF *', errors.template_file_url,
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => updateField('template_file_url', e.target.files?.[0] || null)}
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50"
        />
      )}

      {/* Dynamic Field Builder */}
      <div>
        <DynamicFieldBuilder
          name="template_fields"
          label="Template Field Configuration"
          value={values.template_fields}
          onChange={(fields) => updateField('template_fields', fields)}
          error={errors.template_fields}
          helperText="Configure how placeholder fields should be handled during the document workflow"
          required
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default TemplateForm;