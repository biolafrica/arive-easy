import { DashboardLayout } from "@/components/layouts/dashboard/DashBoardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="seller">
      {children}
    </DashboardLayout>
  );
}