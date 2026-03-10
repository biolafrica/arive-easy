import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import SellerDashboardListingsClientView from "@/components/sections/dashboard/listing/ListingsClientView";
import { AllPropertyListingGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { Suspense } from "react";

export const metadata = createMetadata({
  title: "Seller Dashboard - Listings",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/listings",
});

export default function SellerDashboardListings (){
  return(
    <Suspense fallback={<AllPropertyListingGridSkeleton/>}>
      <PageContainer >
        <SellerDashboardListingsClientView/>
      </PageContainer>
    </Suspense>
 
)
}