import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserForm from "@/components/sections/dashboard/settings/UserForm";
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection";
import ResetPasswordForm from "@/components/sections/dashboard/settings/userPasswordReset";

export default function UserDashboardSettings (){
  return(
    <PageContainer>
      <SettingsSection
        title="Personal Information"
        description="Update your personal details and contact information."
        className="border-b border-border"
      >
        <UserForm/>
      </SettingsSection>

      <SettingsSection
        title="Change Password"
        description="Update your password associated with your account."
      >
        <ResetPasswordForm/>
      </SettingsSection>

    </PageContainer>
  )
}