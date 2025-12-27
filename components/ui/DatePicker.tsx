'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import { CalendarDateRangeIcon } from '@heroicons/react/24/outline';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          disabled={disabled}
          className={`
            flex h-10 w-full items-center justify-between rounded-lg border 
            border-border bg-card px-3 py-2 text-sm
            ring-offset-background placeholder:text-secondary
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            hover:border-secondary transition-colors
            ${!value && 'text-secondary'}
            ${className}
          `}
        >
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
          <CalendarDateRangeIcon className="ml-2 h-4 w-4 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-auto p-0 bg-card rounded-lg border border-border shadow-lg z-50"
          align="start"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            disabled={disabled}
            initialFocus
            className="p-3"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-secondary rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-hover rounded-md",
              day_selected: "bg-accent text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white",
              day_today: "bg-hover text-heading",
              day_outside: "text-secondary opacity-50",
              day_disabled: "text-secondary opacity-50",
              day_hidden: "invisible",
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}