interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="text-2xl font-semibold text-heading">
        {title}
      </h2>

      <div className="mt-4 space-y-4 text-secondary text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}
