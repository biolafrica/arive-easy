import { AMENITY_ICON_MAP, DefaultAmenityIcon } from "@/lib/amenityIcons";
import { PropertyAmenitiesProps } from "@/type/pages/property";


export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="mb-4 font-semibold text-heading">
        Features & Amenities
      </h3>

      <ul className="grid grid-cols-1 gap-3 text-sm ">
        {amenities.map((amenity) => {
          const Icon =
            AMENITY_ICON_MAP[amenity] ?? DefaultAmenityIcon;

          return (
            <li
              key={amenity}
              className="flex items-center gap-2 text-secondary"
            >
              <Icon className="h-5 w-5 shrink-0 text-black" />
              <span>{amenity}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

