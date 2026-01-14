'use client';

interface Props {
  title: string;
  description: string;
}

export function ApplicationStageHeader({
  title,
  description,
}: Props) {
  return (
    <div className="space-y-2 text-center max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold text-heading sm:text-3xl">
        {title}
      </h2>

      <p className="text-sm sm:text-base text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}
