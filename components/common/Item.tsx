export function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-secondary">
      <span>{label}</span>
      <span className="font-medium text-heading">{value}</span>
    </div>
  );
}