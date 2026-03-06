import { createMetadata } from "@/components/common/metaData";
import { FAQSection } from "@/components/sections/public/faq/FAQSection";


export const metadata = createMetadata({
  title: "Seller Dashboard - Support",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/support",
});

export default function SellerDashboardSupport (){
  return(
    <div className="md:border rounded-lg md:bg-white p-1 md:p-10">
      <div className="">
        <FAQSection variant="tabs" description="email us on info@kletch.com if you can't find your question here" />
      </div>
   
    </div>
  )
}