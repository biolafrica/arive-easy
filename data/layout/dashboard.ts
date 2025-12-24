import { DashboardRole } from "@/type/layout/dashboard";
import { NavItem } from "@/type/layout/public";

export const NAV_ITEMS: Record<DashboardRole, NavItem[]> = {
  user: [
    { label: 'Dashboard', href: '/user-dashboard' },
    { label: 'Applications', href: '/user-dashboard/applications' },
    { label: 'Payment', href: '/user-dashboard/payments' },
    { label: 'Properties', href: '/user-dashboard/properties' },
  ],
  seller: [
    { label: 'Dashboard', href: '/seller-dashboard' },
    { label: 'Listings', href: '/seller-dashboard/listings' },
    { label: 'Applications', href: '/seller-dashboard/applications' },
    { label: 'Transactions', href: '/seller-dashboard/transactions' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Properties', href: '/admin/properties' },
  ],
};