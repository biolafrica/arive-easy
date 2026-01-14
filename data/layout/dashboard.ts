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
    { label: 'Offers', href: '/seller-dashboard/offers' },
    { label: 'Transactions', href: '/seller-dashboard/transactions'},
    { label: 'Documents', href: '/seller-dashboard/documents' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin-dashboard' },
    { label: 'Applications', href: '/admin-dashboard/applications' },
    { label: 'Transactions', href: '/admin-dashboard/transactions' },
    { label: 'Documents', href: '/admin-dashboard/documents' },
    { label: 'Users', href: '/admin-dashboard/users' },
    { label: 'Properties', href: '/admin-dashboard/properties' },
  ],
};