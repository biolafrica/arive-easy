import { AMENITY_ICON_MAP, DefaultAmenityIcon } from "@/lib/amenityIcons";

interface PropertyAmenitiesProps {
  items: string[];
}

export function PropertyAmenities({ items }: PropertyAmenitiesProps) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="mb-4 font-semibold text-heading">
        Features & Amenities
      </h3>

      <ul className="grid grid-cols-1 gap-3 text-sm ">
        {items.map((item) => {
          const Icon =
            AMENITY_ICON_MAP[item] ?? DefaultAmenityIcon;

          return (
            <li
              key={item}
              className="flex items-center gap-2 text-secondary"
            >
              <Icon className="h-5 w-5 shrink-0 text-black" />
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

