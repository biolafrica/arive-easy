'use client';

import { CalendarDateRangeIcon } from '@heroicons/react/24/solid';
import React, { useMemo, useCallback, useEffect, useState } from 'react';

export interface CompositeDatePickerProps {
  value?: string; 
  onChange?: (date: string | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string; // ISO date string for minimum date
  max?: string; // ISO date string for maximum date
  yearRange?: { start: number; end: number };
  className?: string;
  error?: boolean;
  format?: 'DMY' | 'MDY' | 'YMD'; 
  showIcon?: boolean;
  labels?: {
    day?: string;
    month?: string;
    year?: string;
  };
}

interface DateParts {
  day: string;
  month: string;
  year: any;
}

const MONTHS = [
  { value: '01', label: 'January', shortLabel: 'Jan' },
  { value: '02', label: 'February', shortLabel: 'Feb' },
  { value: '03', label: 'March', shortLabel: 'Mar' },
  { value: '04', label: 'April', shortLabel: 'Apr' },
  { value: '05', label: 'May', shortLabel: 'May' },
  { value: '06', label: 'June', shortLabel: 'Jun' },
  { value: '07', label: 'July', shortLabel: 'Jul' },
  { value: '08', label: 'August', shortLabel: 'Aug' },
  { value: '09', label: 'September', shortLabel: 'Sep' },
  { value: '10', label: 'October', shortLabel: 'Oct' },
  { value: '11', label: 'November', shortLabel: 'Nov' },
  { value: '12', label: 'December', shortLabel: 'Dec' },
];

export function CompositeDatePicker({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  min,
  max,
  yearRange,
  className = '',
  error = false,
  format = 'DMY',
  showIcon = true,
  labels = {},
}: CompositeDatePickerProps) {
  const parseDateValue = useCallback((dateStr: string | undefined): DateParts => {
    if (!dateStr) return { day: '', month: '', year: '' };
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { day: '', month: '', year: '' };
    
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      year: String(date.getFullYear()),
    };
  }, []);

  const [dateParts, setDateParts] = useState<DateParts>(() => parseDateValue(value));

  useEffect(() => {
    setDateParts(parseDateValue(value));
  }, [value, parseDateValue]);


  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = yearRange?.start ?? currentYear - 100;
    const endYear = yearRange?.end ?? currentYear + 10;
    
    const yearsList = [];
    for (let year = endYear; year >= startYear; year--) {
      yearsList.push({ value: String(year), label: String(year) });
    }
    return yearsList;
  }, [yearRange]);

  const days = useMemo(() => {
    const selectedMonth = parseInt(dateParts.month || '1');
    const selectedYear = parseInt(dateParts.year || new Date().getFullYear());
    
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    
    const daysList = [];
    for (let day = 1; day <= daysInMonth; day++) {
      daysList.push({ 
        value: String(day).padStart(2, '0'), 
        label: String(day) 
      });
    }
    return daysList;
  }, [dateParts.month, dateParts.year]);

  const updateDate = useCallback((parts: DateParts) => {
    setDateParts(parts);
    
    if (parts.day && parts.month && parts.year) {
      const dateStr = `${parts.year}-${parts.month}-${parts.day}`;
      const date = new Date(dateStr);
      

      if (!isNaN(date.getTime())) {
        if (min && dateStr < min) return;
        if (max && dateStr > max) return;
        
        onChange?.(dateStr);
      }
    } else {
      onChange?.(undefined);
    }
  }, [onChange, min, max]);

  const handleDayChange = (newDay: string) => {
    updateDate({ ...dateParts, day: newDay });
  };

  const handleMonthChange = (newMonth: string) => {
    const newMonthDays = new Date(
      parseInt(dateParts.year || new Date().getFullYear()), 
      parseInt(newMonth), 
      0
    ).getDate();
    
    const adjustedDay = dateParts.day && parseInt(dateParts.day) > newMonthDays 
      ? String(newMonthDays).padStart(2, '0')
      : dateParts.day;
    
    updateDate({ ...dateParts, month: newMonth, day: adjustedDay });
  };

  const handleYearChange = (newYear: string) => {
    const newMonthDays = new Date(
      parseInt(newYear), 
      parseInt(dateParts.month || '1'), 
      0
    ).getDate();
    
    const adjustedDay = dateParts.day && parseInt(dateParts.day) > newMonthDays 
      ? String(newMonthDays).padStart(2, '0')
      : dateParts.day;
    
    updateDate({ ...dateParts, year: newYear, day: adjustedDay });
  };

  const selectClassName = `
    flex-1 px-3 py-2 bg-transparent text-text placeholder-secondary
    focus:outline-none focus:ring-0 border-0
    disabled:cursor-not-allowed disabled:opacity-50
    cursor-pointer
  `;

  const renderSelects = () => {
    const daySelect = (
      <select
        key="day"
        value={dateParts.day}
        onChange={(e) => handleDayChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={selectClassName}
        onBlur={onBlur}
        aria-label={labels.day || "Day"}
      >
        <option value="">Day</option>
        {days.map(day => (
          <option key={day.value} value={day.value}>
            {day.label}
          </option>
        ))}
      </select>
    );

    const monthSelect = (
      <select
        key="month"
        value={dateParts.month}
        onChange={(e) => handleMonthChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={selectClassName}
        onBlur={onBlur}
        aria-label={labels.month || "Month"}
      >
        <option value="">Month</option>
        {MONTHS.map(month => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    );

    const yearSelect = (
      <select
        key="year"
        value={dateParts.year}
        onChange={(e) => handleYearChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={selectClassName}
        onBlur={onBlur}
        aria-label={labels.year || "Year"}
      >
        <option value="">Year</option>
        {years.map(year => (
          <option key={year.value} value={year.value}>
            {year.label}
          </option>
        ))}
      </select>
    );

    const orderMap = {
      'DMY': [daySelect, monthSelect, yearSelect],
      'MDY': [monthSelect, daySelect, yearSelect],
      'YMD': [yearSelect, monthSelect, daySelect],
    };

    return orderMap[format];
  };

  return (
    <div
      className={`
        flex items-center rounded-lg border bg-card
        transition-all duration-200
        ${error 
          ? 'border-red-500 focus-within:ring-red-500' 
          : 'border-border hover:border-secondary focus-within:border-transparent'
        }
        ${!error && 'focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {renderSelects().map((select, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-secondary select-none">/</span>
          )}
          {select}
        </React.Fragment>
      ))}
      
      {showIcon && (
        <div className="pr-3">
          <CalendarDateRangeIcon className="h-4 w-4 text-secondary" />
        </div>
      )}
    </div>
  );
}