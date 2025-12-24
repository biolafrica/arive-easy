import { ReactNode } from 'react';
export type DashboardRole = 'admin' | 'seller' | 'user';


export interface NavItem {
  label: string;
  href: string;
}

export interface DashboardLayoutProps {
  role: DashboardRole;
  children: ReactNode;
}