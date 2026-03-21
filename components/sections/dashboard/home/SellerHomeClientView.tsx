'use client'

import { SellerDashboadStats } from "@/components/cards/dashboard/SellerDashboard";
import { DashboardWelcomeHeader } from "./DashboardWelcomeHeader";
import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function SellerHomeClientView() {
  const { user } = useAuthContext();
  const router = useRouter();

  return(
    <>
      <DashboardWelcomeHeader
        name={user?.user_metadata?.name || ""}
        description='Manage your property listings and documents from your seller dashboard.'
        primaryAction={{ label: 'Create Documents', onClick: () => router.push('/seller-dashboard/documents') }}
        secondaryAction={{ label: 'Upload Properties', onClick: () => router.push('/seller-dashboard/listings') }}
        illustrationSrc="/images/dashboard-welcome.svg"
      />

      <SellerDashboadStats/>
    </>
  )

}