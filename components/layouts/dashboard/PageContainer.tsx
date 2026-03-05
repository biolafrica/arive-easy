import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'md:border rounded-lg md:bg-white p-1 md:p-5',
        className
      )}
    >
      {children}
    </div>
  );
}
