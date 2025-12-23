import { FooterColumn, NavItem } from "@/type/layout/public";

export const DEFAULT_NAV: NavItem[] = [
  { label: 'View Properties', href: '/properties' },
  { label: 'Mortgage Calculator', href: '/calculator' },
  { label: 'Support', href: '/support' },
];


export const DASHBOARD_BY_ROLE: Record<string, string> = {
  buyer: '/dashboard',
  seller: '/seller/dashboard',
  admin: '/admin/dashboard',
};


export const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Properties', href: '/properties' },
      { label: 'Mortgage Calculator', href: '/calculator' },
      { label: 'Home', href: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/support' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Articles', href: '/articles' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
];