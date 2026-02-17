'use client';

import { useState } from 'react';
import { TemplateField } from '@/type/form';
import { Button } from '@/components/primitives/Button';
import { PartnerDocumentData, TemplateBase } from '@/type/pages/dashboard/documents';

interface PartnerDocumentFormProps {
  template: TemplateBase;
  initialValues?: Partial<PartnerDocumentData>;
  onSubmit: (values: PartnerDocumentData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function PartnerDocumentForm({ 
  template,
  initialValues = {}, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Save Template'
}: PartnerDocumentFormProps) {

  const [values, setValues] = useState<PartnerDocumentData>({
    document_name: `${template.name } - Custom`,
    document_description: '',
    static_data: {},
    custom_clauses: [],
    custom_terms: {},
    ...initialValues
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editableFields = template.template_fields.filter(
    field => field.fill_stage === 'partner_setup' && field.is_editable_by_partner
  );

  const updateField = (name: keyof PartnerDocumentData, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: ''}));
    }
  };

  const updateStaticData = (fieldKey: string, value: any) => {
    setValues(prev => ({
      ...prev,
      static_data: { ...prev.static_data, [fieldKey]: value }
    }));
  };

  const addCustomClause = () => {
    setValues(prev => ({
      ...prev,
      custom_clauses: [...prev.custom_clauses, '']
    }));
  };

  const updateCustomClause = (index: number, value: string) => {
    setValues(prev => ({
      ...prev,
      custom_clauses: prev.custom_clauses.map((clause, i) => 
        i === index ? value : clause
      )
    }));
  };

  const removeCustomClause = (index: number) => {
    setValues(prev => ({
      ...prev,
      custom_clauses: prev.custom_clauses.filter((_, i) => i !== index)
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.document_name.trim()) {
      newErrors.document_name = 'Document name is required';
    }

    const requiredFields = editableFields.filter(field => field.is_required);
    requiredFields.forEach(field => {
      if (!values.static_data[field.field_key]?.toString().trim()) {
        newErrors[`static_data.${field.field_key}`] = `${field.label} is required`;
      }
    });

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
      console.error('Partner document submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldInput = (field: TemplateField) => {
    const value = values.static_data[field.field_key] || '';
    const error = errors[`static_data.${field.field_key}`];

    const inputProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        updateStaticData(field.field_key, e.target.value),
      className: `w-full px-3 py-2 border rounded-lg ${error ? 'border-red-500' : 'border-border'}`,
      placeholder: field.placeholder_text || `Enter ${field.label.toLowerCase()}`,
      required: field.is_required
    };

    switch (field.field_type) {
      case 'textarea':
        return (
          <textarea
            {...inputProps}
            rows={3}
          />
        );
      case 'email':
        return (
          <input
            {...inputProps}
            type="email"
          />
        );
      case 'phone':
        return (
          <input
            {...inputProps}
            type="tel"
          />
        );
      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              {...inputProps}
              type="number"
              className={`${inputProps.className} pl-8`}
              min="0"
              step="0.01"
            />
          </div>
        );
      default:
        return (
          <input
            {...inputProps}
            type="text"
          />
        );
    }
  };

  const fieldsByCategory = editableFields.reduce((groups, field) => {
    const category = field.field_key.split('.')[0]; // e.g., 'seller' from 'seller.company_name'
    if (!groups[category]) groups[category] = [];
    groups[category].push(field);
    return groups;
  }, {} as Record<string, TemplateField[]>);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-heading">Customize Your Template</h2>
        <p className="text-secondary">Fill in your standard information for: {template.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Document Name *
            </label>
            <input
              type="text"
              value={values.document_name}
              onChange={(e) => updateField('document_name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${errors.document_name ? 'border-red-500' : 'border-border'}`}
              placeholder="e.g., Lekki Gardens - Contract of Sales"
            />
            {errors.document_name && (
              <p className="text-sm text-red-600 mt-1">{errors.document_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Description
            </label>
            <input
              type="text"
              value={values.document_description}
              onChange={(e) => updateField('document_description', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg"
              placeholder="Brief description of this document"
            />
          </div>
        </div>

        {Object.entries(fieldsByCategory).map(([category, fields]) => (
          <div key={category} className="border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {category.replace('_', ' ')} Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-heading mb-1">
                    {field.label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {renderFieldInput(field)}
                  
                  {field.help_text && (
                    <p className="text-xs text-secondary mt-1">{field.help_text}</p>
                  )}
                  
                  {errors[`static_data.${field.field_key}`] && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors[`static_data.${field.field_key}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Additional Terms & Conditions</h3>
            <Button type="button" variant="outline" onClick={addCustomClause}>
              Add Clause
            </Button>
          </div>
          
          <div className="space-y-3">
            {values.custom_clauses.map((clause, index) => (
              <div key={index} className="flex gap-3">
                <textarea
                  value={clause}
                  onChange={(e) => updateCustomClause(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg"
                  rows={2}
                  placeholder={`Additional clause ${index + 1}...`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeCustomClause(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            
            {values.custom_clauses.length === 0 && (
              <p className="text-secondary text-center py-4">
                No additional clauses yet. Click "Add Clause" to include your standard terms.
              </p>
            )}
          </div>
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
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PartnerDocumentForm;