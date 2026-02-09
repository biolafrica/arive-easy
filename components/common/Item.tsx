type InfoItemProps = {
  label: string;
  value: React.ReactNode;
};

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
  columns?: 1 | 2;
};

export function InfoCard({
  title,
  children,
  columns = 1,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="font-semibold text-heading mb-4">{title}</h3>

      <dl
        className={
          columns === 2
            ? "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm"
            : "space-y-2 text-sm"
        }
      >
        {children}
      </dl>
    </div>
  );
}


export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
