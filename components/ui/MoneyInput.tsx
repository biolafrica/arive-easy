'use client';

import React, { useState, useCallback, useEffect } from 'react';

export interface MoneyInputProps {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  currency?: string; // e.g., 'USD', 'EUR', 'GBP', 'NGN'
  locale?: string; // e.g., 'en-US', 'en-GB', 'en-NG'
  className?: string;
  error?: boolean;
  showCurrencySymbol?: boolean;
}

export function MoneyInput({
  value,
  onChange,
  onBlur,
  name,
  placeholder = '0.00',
  disabled = false,
  required = false,
  min,
  max,
  currency = 'USD',
  locale = 'en-US',
  className = '',
  error = false,
  showCurrencySymbol = true,
}: MoneyInputProps) {
  const getCurrencySymbol = useCallback((curr: string, loc: string) => {
    try {
      const formatter = new Intl.NumberFormat(loc, {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const parts = formatter.formatToParts(0);
      const symbolPart = parts.find(part => part.type === 'currency');
      return symbolPart?.value || '$';
    } catch {
      return '$';
    }
  }, []);

  const currencySymbol = getCurrencySymbol(currency, locale);

  const formatDisplayValue = useCallback((num: number | undefined): string => {
    if (num === undefined || num === null || isNaN(num)) return '';
    
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      return num.toFixed(2);
    }
  }, [locale]);

  const parseDisplayValue = useCallback((str: string): number | undefined => {
    if (!str || str.trim() === '') return undefined;
    
    const cleaned = str.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    
    if (isNaN(num)) return undefined;
    return num;
  }, []);

  const [displayValue, setDisplayValue] = useState<string>(() => 
    formatDisplayValue(typeof value === 'string' ? parseFloat(value) : value)
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      setDisplayValue(formatDisplayValue(numValue));
    }
  }, [value, formatDisplayValue, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    const numValue = parseDisplayValue(displayValue);
    if (numValue !== undefined) {
      setDisplayValue(numValue.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    const numValue = parseDisplayValue(displayValue);
    
    let finalValue = numValue;
    if (finalValue !== undefined) {
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
    }
    
    setDisplayValue(formatDisplayValue(finalValue));
    
    onChange?.(finalValue);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    const isValid = /^-?\d*\.?\d*$/.test(inputValue);
    
    if (isValid || inputValue === '') {
      setDisplayValue(inputValue);
      
      const numValue = parseDisplayValue(inputValue);
    }
  };

  const inputClassName = `
    block w-full rounded-lg border px-3 py-2 
    bg-card text-text placeholder-secondary
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
    ${error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-border hover:border-secondary'
    }
    disabled:bg-hover disabled:text-disabled disabled:cursor-not-allowed
    ${showCurrencySymbol ? 'pl-8' : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {showCurrencySymbol && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
          {currencySymbol}
        </span>
      )}
      <input
        type="text"
        inputMode="decimal"
        name={name}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClassName}
        aria-invalid={error}
      />
    </div>
  );
}

export default MoneyInput;