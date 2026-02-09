export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  action?: React.ReactNode;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showError?: boolean;
  helperText?: string;
  prefixIcon?: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  error?: string;
  showError?: boolean;
  helperText?: string;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  showError?: boolean;
  helperText?: string;
  characterCount?: {
    text: string;
    isError?: boolean;
    isWarning?: boolean;
  };
}

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  showError?: boolean;
  helperText?: string;
  labelAction?: React.ReactNode;
  children: React.ReactNode;
}

interface InfoBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function inputClass(hasError?: boolean) {
  return `
    mt-1 block w-full rounded-lg border px-3 py-2
    bg-card text-text transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
    ${hasError
      ? 'border-red-500 focus:ring-red-500'
      : 'border-border hover:border-secondary'
    }
  `;
}

export function SectionHeader({ title, description, icon, action }: SectionHeaderProps) {
  return (
    <div className="border-b border-border pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-heading">{title}</h3>
            <p className="text-sm text-secondary mt-1">{description}</p>
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}

export function FormLabel({ htmlFor, required, optional, children, action }: FormLabelProps) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-heading">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
        {optional && <span className="text-secondary font-normal ml-1">(Optional)</span>}
      </label>
      {action}
    </div>
  );
}

export function FormInput({ 
  error, 
  showError, 
  helperText, 
  prefixIcon,
  className = '',
  ...props 
}: FormInputProps) {
  return (
    <div>
      <div className="relative">
        {prefixIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            {prefixIcon}
          </span>
        )}
        <input
          {...props}
          className={` ${inputClass(showError)}
            ${prefixIcon ? 'pl-7' : ''}
            ${props.disabled ? 'bg-hover text-secondary cursor-not-allowed' : ''}
            ${className}
          `}
        />
      </div>
      {showError && error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {!showError && helperText && (
        <p className="mt-1 text-xs text-secondary">{helperText}</p>
      )}
    </div>
  );
}

export function FormSelect({ 
  options, 
  error, 
  showError, 
  helperText,
  className = '',
  ...props 
}: FormSelectProps) {
  return (
    <div>
      <select
        {...props}
        className={` ${inputClass(showError)}
          ${props.disabled ? 'bg-hover text-disabled cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {showError && error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {!showError && helperText && (
        <p className="mt-1 text-xs text-secondary">{helperText}</p>
      )}
    </div>
  );
}

export function FormTextarea({ 
  error, 
  showError, 
  helperText,
  characterCount,
  className = '',
  ...props 
}: FormTextareaProps) {
  return (
    <div>
      <textarea
        {...props}
        className={` ${inputClass(showError)}
          ${className}
        `}
      />
      <div className="mt-1 flex justify-between items-center">
        {showError && error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : characterCount ? (
          <p className={`text-xs ${
            characterCount.isError 
              ? 'text-red-500' 
              : characterCount.isWarning 
              ? 'text-amber-500' 
              : 'text-secondary'
          }`}>
            {characterCount.text}
          </p>
        ) : helperText ? (
          <p className="text-xs text-secondary">{helperText}</p>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export function FormField({
  label,
  htmlFor,
  required,
  optional,
  error,
  showError,
  helperText,
  labelAction,
  children,
}: FormFieldProps) {
  return (
    <div>
      <FormLabel 
        htmlFor={htmlFor} 
        required={required} 
        optional={optional}
        action={labelAction}
      >
        {label}
      </FormLabel>
      {children}
      {showError && error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {!showError && helperText && (
        <p className="mt-1 text-xs text-secondary">{helperText}</p>
      )}
    </div>
  );
}

export function InfoBox({ title, children, className = '' }: InfoBoxProps) {
  return (
    <div className={`bg-hover rounded-lg p-4 border border-border ${className}`}>
      {title && (
        <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}
