'use client'

import { useAuthContext } from "@/providers/auth-provider";
import { DashboardWelcomeHeader } from "../common/DashboardWelcomeHeader";
import { AdminDashboardStats } from "@/components/common/AdminDashboardStats";
import { useRouter } from "next/navigation";

export default function AdminHomeClientView(){
  const { user } = useAuthContext();
  const router = useRouter()

  return(
    <div className="space-y-4">

      <DashboardWelcomeHeader
        name={user?.user_metadata?.name || "Moe"}
        description='Manage your kletch  activites from your Admin dashboard.'
        primaryAction={{ label: 'Explore Applications', onClick: () => router.push('/admin-dashboard/applications') }}
        secondaryAction={{ label: 'Explore Properties', onClick: () => router.push('/admin-dashboard/properties') }}
        illustrationSrc="/images/dashboard-welcome.svg"
      />
      
      <AdminDashboardStats section="home" />

    </div>
  )
}