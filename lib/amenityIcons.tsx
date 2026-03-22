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
  VideoCameraIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  ShoppingCartIcon,
  FunnelIcon,
} from '@heroicons/react/24/solid';

export const AMENITY_ICON_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  'swimming_pool': LifebuoyIcon,
  'gym': Cog6ToothIcon,
  'security': ShieldCheckIcon,
  'internet': WifiIcon,
  'garden': ViewColumnsIcon,
  'air_conditioning': CursorArrowRippleIcon,
  'parking': TruckIcon,
  'generator': LightBulbIcon,
  'balcony': WindowIcon,
  'elevator': WindowIcon,
  'cctv': VideoCameraIcon,
  'water': FunnelIcon,
  'smart_home': DevicePhoneMobileIcon,
  'servant_quarters': HomeIcon,
  'laundry': ShoppingCartIcon,
};

export const DefaultAmenityIcon = CheckCircleIcon;
