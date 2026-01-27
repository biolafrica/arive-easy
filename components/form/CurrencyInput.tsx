'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  helperText?: string;
  currency?: string;
  locale?: string;
  allowNegative?: boolean;
  precision?: number;
  autoFocus?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "Enter amount",
  min = 0,
  max,
  disabled = false,
  className = "",
  error,
  label,
  helperText,
  currency = 'USD',
  locale = 'en-US',
  allowNegative = false,
  precision = 2,
  autoFocus = false,
  onBlur,
  onFocus,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format number to display value
  const formatToDisplay = (num: number): string => {
    if (num === 0 && !isFocused) return '';
    
    if (isFocused) {
      // Show raw number when focused for easier editing
      return num === 0 ? '' : num.toString();
    }
    
    // Show formatted currency when not focused
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    }).format(num).replace(/^[^0-9]*/, ''); // Remove currency symbol for cleaner look
  };

  // Parse display value to number
  const parseDisplayValue = (str: string): number => {
    // Remove all non-numeric characters except decimal point and minus
    const cleanStr = str.replace(/[^\d.-]/g, '');
    
    // Handle empty string
    if (!cleanStr || cleanStr === '-') return 0;
    
    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(formatToDisplay(value));
  }, [value, isFocused, locale, currency, precision]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Parse the input value
    const numericValue = parseDisplayValue(inputValue);
    
    // Validate against constraints
    if (!allowNegative && numericValue < 0) return;
    if (min !== undefined && numericValue < min && !isFocused) return;
    if (max !== undefined && numericValue > max) return;

    // Update display value (raw input when focused)
    setDisplayValue(inputValue);
    
    // Update the numeric value
    onChange(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setDisplayValue(value === 0 ? '' : value.toString());
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    const numericValue = parseDisplayValue(displayValue);
    
    // Apply min/max constraints on blur
    let finalValue = numericValue;
    if (min !== undefined && finalValue < min) finalValue = min;
    if (max !== undefined && finalValue > max) finalValue = max;
    
    // Update if value changed due to constraints
    if (finalValue !== numericValue) {
      onChange(finalValue);
    }
    
    setDisplayValue(formatToDisplay(finalValue));
    onBlur?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }
    
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) {
      return;
    }
    
    // Allow: home, end, left, right, down, up
    if (e.keyCode >= 35 && e.keyCode <= 40) {
      return;
    }
    
    // Allow decimal point
    if (e.key === '.' && precision > 0 && displayValue.indexOf('.') === -1) {
      return;
    }
    
    // Allow minus sign at the beginning if negative numbers are allowed
    if (e.key === '-' && allowNegative && displayValue.indexOf('-') === -1 && e.currentTarget.selectionStart === 0) {
      return;
    }
    
    // Ensure that it's a number
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  // Quick amount buttons helper
  const QuickAmountButton = ({ amount, label }: { amount: number; label: string }) => (
    <button
      type="button"
      onClick={() => onChange(amount)}
      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    >
      {label}
    </button>
  );

  const baseInputClasses = `
    block w-full pl-10 pr-4 py-3 
    border rounded-lg
    placeholder-gray-400
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-colors duration-200
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Currency Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          $
        </div>
        
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`${baseInputClasses} ${className}`}
          autoComplete="off"
          inputMode="decimal"
        />
        
        {/* Formatted Preview (when focused and has value) */}
        {isFocused && value > 0 && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-400">
              {new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
              }).format(value)}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* Min/Max Indicators */}
      {(min !== undefined || max !== undefined) && (
        <div className="flex justify-between text-xs text-gray-500">
          {min !== undefined && (
            <span>
              Min: {new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
              }).format(min)}
            </span>
          )}
          {max !== undefined && (
            <span>
              Max: {new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
              }).format(max)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
