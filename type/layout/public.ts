export interface NavItem {
  label: string;
  href: string;
}

export interface HeaderProps {
  navItems?: NavItem[];
  isAuthenticated?: boolean;
  userRole?: 'buyer' | 'seller' | 'admin';
  className?: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  columns?: FooterColumn[];
}
