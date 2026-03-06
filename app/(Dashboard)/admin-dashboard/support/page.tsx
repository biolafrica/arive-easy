import { createMetadata } from "@/components/common/metaData";
import { FAQSection } from "@/components/sections/public/faq/FAQSection";


export const metadata = createMetadata({
  title: "Admin Dashboard - Support",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/supports",
});

export default function AdminDashboardSupport (){
  return(
    <div className="border rounded-lg bg-white p-10">
      <div className="">
        <FAQSection variant="tabs" description="communicate with your superior if you can't find your question here" />
      </div>
   
    </div>
  )
}