interface LegalHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function LegalHeader({
  eyebrow,
  title,
  description,
}: LegalHeaderProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {eyebrow && (
        <p className="text-sm font-medium text-secondary">
          {eyebrow}
        </p>
      )}

      <h1 className="mt-2 text-4xl font-semibold text-heading sm:text-5xl">
        {title}
      </h1>

      {description && (
        <p className="mt-4 text-secondary text-base">
          {description}
        </p>
      )}
    </div>
  );
}
