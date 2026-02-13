export type FieldType = 
| 'text' 
| 'email' 
| 'password' 
| 'number' 
| 'tel' 
| 'url' 
| 'date' 
| 'time' 
| 'datetime-local' 
| 'select' 
| 'textarea' 
| 'checkbox' 
| 'radio'
| 'image'
| 'file'
| 'richtext'
| 'money'


export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
export interface TemplateField {
  id: string;
  placeholder: string ; // The {{placeholder}} text
  label: string;
  field_key: string; // Structured key like 'seller.company_name'
  
  data_source: 'seller' | 'buyer' | 'property' | 'application' | 'system';
  fill_stage: 'partner_setup' | 'dynamic_generation';
  
  field_type: 'text' | 'number' | 'date' | 'currency' | 'address' | 'select' | 'textarea' | 'email' | 'phone';
  is_required: boolean;
  is_editable_by_partner: boolean;
  
  validation_rules?: {
    min_length?: number;
    max_length?: number;
    pattern?: string;
    format?: 'currency' | 'date' | 'phone' | 'email';
  };
  
  default_value?: string;
  help_text?: string;
  placeholder_text?: string;
  
  options?: SelectOption[];
  
  show_conditions?: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: string;
  }>;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
  autoComplete?: string;
  disabled?: boolean;
  helperText?: string;

  accept?: string;
  maxSize?: number; // in MB
  preview?: boolean;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | 'free';

  currency?: string;  // 'USD', 'EUR', 'GBP', 'NGN', etc.
  locale?: string;    // 'en-US', 'en-GB', 'en-NG', etc.
  showCurrencySymbol?: boolean;
}

export interface DynamicFieldBuilderProps {
  name: string;
  label?: string;
  value?: TemplateField[];
  onChange: (fields: TemplateField[]) => void;
  onBlur?: () => void;
  extractFromPdf?: boolean;
  allowManualAdd?: boolean;
  fieldCategories?: string[];
  maxFields?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export interface FormProps<T extends Record<string, any>> {
  fields: FormField[];
  initialValues?: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
  submitLabel?: string;
  onFieldChange?: (name: keyof T, value: any) => void; 
  cancelLabel?: string;
  onCancel?: () => void;
  showCancel?: boolean;
  className?: string;
  submitButtonVariant?: 'filled' | 'secondary' | 'outline';
  fullWidthSubmit?: boolean;
}


export interface ImageFieldProps {
  name: string;
  label?: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  preview?: boolean;
  multiple?: boolean;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | 'free';
  className?: string;
}