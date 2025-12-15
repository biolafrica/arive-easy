import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';


const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-medium',
    'transition-[background-color,color,box-shadow,transform]',
    'duration-150',
    'focus:outline-none focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'active:translate-y-px',
  ].join(' '),
  {
    variants: {
      variant: {
        filled: [
          'bg-[var(--btn-primary-bg)]',
          'text-[var(--btn-primary-text)]',
          'hover:bg-[var(--btn-primary-hover)]',
          'active:bg-[var(--btn-primary-active)]',
          'disabled:bg-[var(--btn-disabled-bg)]',
          'disabled:text-[var(--btn-disabled-text)]',
        ],

        secondary: [
          'bg-[var(--btn-secondary-bg)]',
          'text-[var(--btn-secondary-text)]',
          'hover:bg-[var(--btn-secondary-hover)]',
          'active:bg-[var(--btn-secondary-active)]',
          'disabled:bg-[var(--btn-disabled-bg)]',
          'disabled:text-[var(--btn-disabled-text)]',
        ],

        outline: [
          'border-2',
          'border-[var(--btn-outline-border)]',
          'bg-transparent',
          'text-[var(--btn-outline-text)]',
          'hover:bg-[var(--btn-outline-hover-bg)]',
          'active:bg-[var(--btn-outline-active-bg)]',
          'disabled:border-[var(--btn-disabled-border)]',
          'disabled:text-[var(--btn-disabled-text)]',
          'disabled:bg-transparent',
        ],

        text: [
          'bg-transparent',
          'text-[var(--btn-text-color)]',
          'hover:bg-[var(--btn-text-hover-bg)]',
          'active:bg-[var(--btn-text-active-bg)]',
          'disabled:text-[var(--btn-disabled-text)]',
          'disabled:bg-transparent',
          'underline-offset-4',
          'hover:underline',
        ],

        danger: [
          'bg-[var(--btn-danger-bg)]',
          'text-[var(--btn-danger-text)]',
          'hover:bg-[var(--btn-danger-hover)]',
          'active:bg-[var(--btn-danger-active)]',
          'disabled:bg-[var(--btn-disabled-bg)]',
          'disabled:text-[var(--btn-disabled-text)]',
        ],

        ghost: [
          'bg-transparent',
          'text-[var(--text)]',
          'hover:bg-[var(--hover-bg)]',
          'active:bg-[var(--active-bg)]',
          'disabled:text-[var(--btn-disabled-text)]',
          'disabled:bg-transparent',
        ],
      },

      size: {
        xs: 'px-2.5 py-1 text-xs rounded-md gap-1',
        sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
        md: 'px-4 py-2 text-sm rounded-lg gap-2',
        lg: 'px-6 py-3 text-base rounded-lg gap-2',
        xl: 'px-8 py-4 text-lg rounded-xl gap-3',
      },

      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },

      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },

    defaultVariants: {
      variant: 'filled',
      size: 'md',
      fullWidth: false,
      rounded: 'lg',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      rounded,
      children,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, fullWidth, rounded }), className)}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{loading && loadingText ? loadingText : children}</span>
        {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };