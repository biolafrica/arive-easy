import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  icon?: React.ReactNode;
  dot?: boolean;
}

const variantStyles = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  success: 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200',
  destructive: 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200',
  info: 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200',
  outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  default: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

const dotStyles = {
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  destructive: 'bg-red-600',
  info: 'bg-blue-600',
  default: 'bg-primary',
  secondary: 'bg-secondary-foreground',
  outline: 'bg-foreground',
  ghost: 'bg-accent-foreground',
};

export function Badge({
  className,
  variant = 'default',
  size = 'default',
  icon,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            dotStyles[variant]
          )}
        />
      )}
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  );
}