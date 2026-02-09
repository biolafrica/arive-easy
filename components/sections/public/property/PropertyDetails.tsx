import { InfoCard, InfoItem } from "@/components/common/Item";
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
    <InfoCard title="Property Details">
      <InfoItem label="Address" value={address_full} />
      <InfoItem label="Area" value={`${area_sqm} sqm`} />
      <InfoItem label="Bedrooms" value={bedrooms} />
      <InfoItem label="Bathrooms" value={bathrooms} />
      <InfoItem label="Type" value={property_type} />
      <InfoItem label="Interior" value={interior} />
    </InfoCard>
  );
}


