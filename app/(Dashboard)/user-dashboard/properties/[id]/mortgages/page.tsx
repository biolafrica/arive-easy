import { createMetadata } from "@/components/common/metaData";
import MortgageClientView from "@/components/sections/dashboard/mortgage/MortgageClientView";
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { Suspense } from "react";

export const metadata = createMetadata({
  title: "User Dashboard - Mortgage Detail",
  description: "Find your perfect home in Nigeria...",
});

export default async function MortgageDetailsPage(
  { params }: { params: Promise<{ id: string }> } 
) {
  const {id} =  await params;
  
  return (
    <Suspense fallback={<AllPropertyGridSkeleton/>}>
      <MortgageClientView id={id} /> 
    </Suspense>
  );
}