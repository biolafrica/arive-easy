import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import OfferClientView from "@/components/sections/dashboard/offers/OfferClientView";


export const metadata = createMetadata({
  title: "Seller Dashboard - Offers",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/offers",
});

export default function SellerDashboardOffers (){
  return(
    <PageContainer>
      <OfferClientView/>
    </PageContainer>
  )
}