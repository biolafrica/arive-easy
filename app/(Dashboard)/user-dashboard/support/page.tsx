import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { FAQSection } from "@/components/sections/public/faq/FAQSection";

export default function UserDashboardSupport (){
  return(
    <PageContainer>
      <div className="">
        <FAQSection variant="tabs" description="email us on info@ariveasy.com if you can't find your question here" />
      </div>
    </PageContainer>
  )
}