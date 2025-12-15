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

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
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
}

export interface FormProps<T extends Record<string, any>> {
  fields: FormField[];
  initialValues?: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
  submitLabel?: string;
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