export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h4 className="mb-4 font-semibold text-heading">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-secondary">{label}</span>
      <span className="font-medium text-heading">{value}</span>
    </div>
  );
}