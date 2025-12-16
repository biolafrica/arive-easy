import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;

  align?: 'left' | 'center';
  size?: 'sm' | 'md';
  className?: string;
}


export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  size = 'md',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        isCenter ? 'text-center mx-auto' : 'text-left',
        size === 'sm' ? 'max-w-xl' : 'max-w-2xl',
        className
      )}
    >
      {eyebrow && (
        <p className="text-sm font-medium text-secondary">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-3xl font-semibold text-heading sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-4 text-secondary',
            size === 'sm' ? 'text-base' : 'text-base'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
