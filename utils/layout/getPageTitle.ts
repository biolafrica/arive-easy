import { NAV_ITEMS } from '@/data/layout/dashboard';
import { DashboardRole } from '@/type/layout/dashboard';

export function getPageTitle(
  pathname: string,
  role: DashboardRole
) {
  if (pathname.endsWith('/settings')) return 'Settings';
  if (pathname.endsWith('/support')) return 'Support';

  const items = [...NAV_ITEMS[role]].sort(
    (a, b) => b.href.length - a.href.length
  );

  const exactMatch = items.find(
    (item) => pathname === item.href
  );

  if (exactMatch) return exactMatch.label;

  const prefixMatch = items.find(
    (item) => pathname.startsWith(item.href + '/')
  );

  return prefixMatch?.label ?? '';
}


