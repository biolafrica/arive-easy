import { PropertyDetailsProps } from "@/type/pages/property";

export function PropertyDetails({
  address_full,
  area_sqm,
  bedrooms,
  bathrooms,
  property_type,
  interior,
}: PropertyDetailsProps) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="font-semibold text-heading mb-4">Property Details</h3>

      <dl className="space-y-2 text-sm">
        <Item label="Address" value={address_full} />
        <Item label="Area" value={`${area_sqm} sqm`} />
        <Item label="Bedrooms" value={`${bedrooms}`} />
        <Item label="Bathrooms" value={`${bathrooms}`} />
        <Item label="Type" value={property_type} />
        <Item label="Interior" value={interior} />
      </dl>
    </div>
  );
}

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-secondary">
      <span>{label}</span>
      <span className="font-medium text-heading text-right">{value}</span>
    </div>
  );
}
