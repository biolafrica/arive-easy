'use client';
 
 
interface DateInputProps {
  name: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  placeholder?: string;
  id?: string;
}
 
export default function DateInput({
  name,
  value,
  onChange,
  onBlur,
  min,
  max,
  disabled,
  required,
  error,
  id,
}: DateInputProps) {
  return (
    <>
      <style>{`
        .date-input {
          -webkit-appearance: none;
          appearance: none;
          color-scheme: light dark;
        }
 
        .date-input::-webkit-calendar-picker-indicator {
          opacity: 0.5;
          cursor: pointer;
          border-radius: 4px;
          padding: 2px;
          transition: opacity 150ms ease;
        }
 
        .date-input::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
 
        .date-input::-webkit-datetime-edit {
          padding: 0;
        }
 
        .date-input::-webkit-datetime-edit-fields-wrapper {
          padding: 0;
        }
 
        .date-input::-webkit-datetime-edit-text {
          padding: 0 2px;
          color: var(--color-secondary, #9ca3af);
        }
 
        .date-input::-webkit-datetime-edit-day-field,
        .date-input::-webkit-datetime-edit-month-field,
        .date-input::-webkit-datetime-edit-year-field {
          padding: 1px 2px;
          border-radius: 3px;
          transition: background 150ms ease;
        }
 
        .date-input::-webkit-datetime-edit-day-field:focus,
        .date-input::-webkit-datetime-edit-month-field:focus,
        .date-input::-webkit-datetime-edit-year-field:focus {
          background-color: var(--color-accent, #3b82f6);
          color: white;
          outline: none;
        }
 
        .date-input:disabled::-webkit-calendar-picker-indicator {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
 
      <input
        id={id}
        name={name}
        type="date"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        min={min}
        max={max}
        disabled={disabled}
        required={required}
        className={`
          date-input
          mt-1 block w-full rounded-lg border px-3 py-2
          bg-card text-text placeholder-secondary
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-border hover:border-secondary'
          }
          disabled:bg-hover disabled:text-disabled disabled:cursor-not-allowed
        `}
      />
    </>
  );
}