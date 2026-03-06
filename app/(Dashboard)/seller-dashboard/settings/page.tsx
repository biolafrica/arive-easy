import { createMetadata } from "@/components/common/metaData";
import SellerUserForm from "@/components/sections/dashboard/settings/SellerUserForm";
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection";
import ResetPasswordForm from "@/components/sections/dashboard/settings/userPasswordReset";


export const metadata = createMetadata({
  title: "Seller Dashboard - Settings",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/settings",
});

export default function SellerDashboardSettings (){
  return(
    <div className="md:border rounded-lg md:bg-white p-1 md:p-10">
      <SettingsSection
        title="Personal Information"
        description="Update your personal details and contact information."
        className="border-b border-border"
      >
        <SellerUserForm />
      </SettingsSection>

      <SettingsSection
        title="Change Password"
        description="Update your password associated with your account."
      >
        <ResetPasswordForm/>
      </SettingsSection>

    </div>
  )
}