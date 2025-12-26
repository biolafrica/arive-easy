"use client"

import { UserDashboadStats } from "@/components/cards/dashboard/UserDashboard";
import { PreApprovalCard } from "@/components/cards/dashboard/preApprovalCard";
import { DashboardWelcomeHeader } from "@/components/sections/dashboard/home/DashboardWelcomeHeader";
import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";


export default function UserDashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <div className="md:border rounded-lg md:bg-white p-1 md:p-10">
      
      <DashboardWelcomeHeader
        name={user?.user_metadata?.name || "Pamela"}
        primaryAction={{ label: 'Explore Properties', onClick: () => router.push('/user-dashboard/properties') }}
        secondaryAction={{ label: 'Get Pre-approved', onClick: () => router.push('/user-dashboard/applications') }}
        illustrationSrc="/images/dashboard-welcome.svg"
      />

      <UserDashboadStats/>


      <PreApprovalCard
        status= 'not_started'
      />


    </div>
  );
}