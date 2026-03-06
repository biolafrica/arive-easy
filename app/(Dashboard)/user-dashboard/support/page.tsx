import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { FAQSection } from "@/components/sections/public/faq/FAQSection";

export const metadata = createMetadata({
  title: "User Dashboard - Support",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/user-dashboard/support",
});


export default function UserDashboardSupport (){
  return(
    <PageContainer>
      <div className="">
        <FAQSection variant="tabs" description="email us on info@kletch.com if you can't find your question here" />
      </div>
    </PageContainer>
  )
}