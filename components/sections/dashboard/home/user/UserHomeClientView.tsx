'use client';

import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { DashboardWelcomeHeader } from "../common/DashboardWelcomeHeader";
import { UserDashboadStats } from "@/components/cards/dashboard/UserDashboard";
import PreApprovalDashboardDisplayLogic from "../../approval/PreApprovalDashboardDisplayLogic";
import UserTransactionSummaryTable from "./UserTransactionSummaryTable";

export default function UserHomeClientView() {  
  const { user } = useAuthContext();
  const router = useRouter();
  return(
    <div className="space-y-6">
      <DashboardWelcomeHeader
        name={user?.user_metadata?.name || ""}
        primaryAction={{ label: 'Explore Properties', onClick: () => router.push('/user-dashboard/properties?tab=browse') }}
        secondaryAction={{ label: 'View Applications', onClick: () => router.push('/user-dashboard/applications') }}
        illustrationSrc="/images/dashboard-welcome.svg"
      />

      <UserDashboadStats/>

      <PreApprovalDashboardDisplayLogic/>

      <UserTransactionSummaryTable/>

    </div>
  )
}