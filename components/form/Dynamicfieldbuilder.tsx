'use client';

import { Button } from '../primitives/Button';
import { TemplateField, DynamicFieldBuilderProps} from '@/type/form';

const FieldRow: React.FC<{
  field: TemplateField;
  index: number;
  onChange: (field: TemplateField) => void;
  onDelete: () => void;
}> = ({ field, index, onChange, onDelete }) => {
  const updateField = (updates: Partial<TemplateField>) => {
    onChange({ ...field, ...updates });
  };

  const handlePlaceholderChange = (value: string) => {
    const fieldKey = value.replace(/[{}]/g, ''); // Remove {{ }}
    updateField({ 
      placeholder: value, 
      field_key: fieldKey 
    });
  };

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Field {index + 1}</h4>
        <Button type="button" variant="outline" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Placeholder */}
        <div>
          <label className="block text-sm font-medium mb-1">Placeholder *</label>
          <input
            type="text"
            value={field.placeholder}
            onChange={(e) => handlePlaceholderChange(e.target.value)}
            placeholder="{{seller.company_name}}"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium mb-1">Label *</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder="Company Name"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Field Key - Auto-generated but editable */}
        <div>
          <label className="block text-sm font-medium mb-1">Field Key *</label>
          <input
            type="text"
            value={field.field_key}
            onChange={(e) => updateField({ field_key: e.target.value })}
            placeholder="seller.company_name"
            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Auto-generated from placeholder</p>
        </div>

        {/* Data Source */}
        <div>
          <label className="block text-sm font-medium mb-1">Data Source</label>
          <select
            value={field.data_source}
            onChange={(e) => updateField({ 
              data_source: e.target.value as TemplateField['data_source'],
              fill_stage: e.target.value === 'seller' ? 'partner_setup' : 'dynamic_generation'
            })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
            <option value="property">Property</option>
            <option value="application">Application</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Field Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Field Type</label>
          <select
            value={field.field_type}
            onChange={(e) => updateField({ field_type: e.target.value as TemplateField['field_type'] })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="text">Text</option>
            <option value="currency">Currency</option>
            <option value="date">Date</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="address">Address</option>
            <option value="textarea">Long Text</option>
          </select>
        </div>

        {/* Fill Stage */}
        <div>
          <label className="block text-sm font-medium mb-1">Fill Stage</label>
          <select
            value={field.fill_stage}
            onChange={(e) => updateField({ fill_stage: e.target.value as TemplateField['fill_stage'] })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="partner_setup">Partner Setup</option>
            <option value="dynamic_generation">Dynamic Generation</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={field.is_required}
            onChange={(e) => updateField({ is_required: e.target.checked })}
            className="mr-2"
          />
          Required
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={field.is_editable_by_partner}
            onChange={(e) => updateField({ is_editable_by_partner: e.target.checked })}
            className="mr-2"
          />
          Partner Editable
        </label>
      </div>
    </div>
  );
};

const DynamicFieldBuilder: React.FC<DynamicFieldBuilderProps> = ({
  name,
  label = "Template Fields",
  value = [],
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
}) => {
  const fields = value || [];

  const addNewField = () => {
    const newField: TemplateField = {
      id: `field_${Date.now()}`,
      placeholder: '',
      label: '',
      field_key: '',
      data_source: 'seller',
      fill_stage: 'partner_setup',
      field_type: 'text',
      is_required: true,
      is_editable_by_partner: true,
      default_value: '',
      help_text: ''
    };

    onChange([...fields, newField]);
  };

  const updateField = (index: number, updatedField: TemplateField) => {
    const newFields = fields.map((field, i) => 
      i === index ? updatedField : field
    );
    onChange(newFields);
  };

  const deleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onChange(newFields);
  };

  const addCommonField = (type: 'seller' | 'buyer' | 'property') => {
    const commonFields = {
      seller: [
        { placeholder: '{{seller.company_name}}', label: 'Company Name', field_key: 'seller.company_name' },
        { placeholder: '{{seller.address}}', label: 'Company Address', field_key: 'seller.address' },
        { placeholder: '{{seller.phone}}', label: 'Phone Number', field_key: 'seller.phone' },
      ],
      buyer: [
        { placeholder: '{{buyer.full_name}}', label: 'Full Name', field_key: 'buyer.full_name' },
        { placeholder: '{{buyer.email}}', label: 'Email', field_key: 'buyer.email' },
        { placeholder: '{{buyer.address}}', label: 'Address', field_key: 'buyer.address' },
      ],
      property: [
        { placeholder: '{{property.address}}', label: 'Property Address', field_key: 'property.address' },
        { placeholder: '{{property.type}}', label: 'Property Type', field_key: 'property.type' },
        { placeholder: '{{purchase.total_price}}', label: 'Total Price', field_key: 'purchase.total_price' },
      ]
    };

    const newFields = commonFields[type].map((fieldData, index) => ({
      id: `field_${Date.now()}_${index}`,
      ...fieldData,
      data_source: type === 'property' ? (fieldData.field_key.includes('purchase') ? 'application' : 'property') : type,
      fill_stage: type === 'seller' ? 'partner_setup' : 'dynamic_generation',
      field_type: fieldData.field_key.includes('email') ? 'email' : 
                  fieldData.field_key.includes('phone') ? 'phone' :
                  fieldData.field_key.includes('address') ? 'address' :
                  fieldData.field_key.includes('price') ? 'currency' : 'text',
      is_required: true,
      is_editable_by_partner: type === 'seller',
      default_value: '',
      help_text: ''
    })) as TemplateField[];

    onChange([...fields, ...newFields]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {helperText && <p className="text-sm text-gray-600 mt-1">{helperText}</p>}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      {/* Quick Add Section */}
      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">Quick Add Common Fields</h4>
        <div className="flex gap-2 flex-wrap">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => addCommonField('seller')}
            disabled={disabled}
          >
            + Seller Fields
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => addCommonField('buyer')}
            disabled={disabled}
          >
            + Buyer Fields
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => addCommonField('property')}
            disabled={disabled}
          >
            + Property Fields
          </Button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No fields yet.</p>
            <p className="text-sm">Use "Quick Add" buttons above or "Add Custom Field".</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <FieldRow
                key={field.id}
                field={field}
                index={index}
                onChange={(updatedField) => updateField(index, updatedField)}
                onDelete={() => deleteField(index)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h4 className="font-medium">Configure Fields ({fields.length})</h4>
          <Button type="button" variant="outline" onClick={addNewField} disabled={disabled}>
            Add Custom Field
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DynamicFieldBuilder;