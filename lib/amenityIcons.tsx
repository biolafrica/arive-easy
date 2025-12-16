import {
  LifebuoyIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  WifiIcon,
  ViewColumnsIcon,
  CursorArrowRippleIcon,
  TruckIcon,
  LightBulbIcon,
  FireIcon,
  WindowIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export const AMENITY_ICON_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  'Swimming Pool': LifebuoyIcon,
  'Gym / Fitness Center': Cog6ToothIcon,
  '24/7 Security': ShieldCheckIcon,
  'High-Speed Internet': WifiIcon,
  'Garden & Landscaping': ViewColumnsIcon,
  'Air Conditioning': CursorArrowRippleIcon,
  'Parking Space': TruckIcon,
  'Backup Generator': LightBulbIcon,
  'Modern Kitchen': FireIcon,
  'Balcony / Terrace': WindowIcon,
};

export const DefaultAmenityIcon = CheckCircleIcon;
