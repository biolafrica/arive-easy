import MortgageClientView from "@/components/sections/dashboard/mortgage/MortgageClientView";
import { MortgageDetailSkeleton } from "@/components/skeleton/MortgageCardSkeleton";
import { Suspense } from "react";

export default async function MortgageDetailsPage(
  { params }: { params: Promise<{ id: string }> } 
) {
  const {id} =  await params;
  return (
    <Suspense fallback={<MortgageDetailSkeleton />}>
      {/* <MortgageClientView 
        mortgage={{}} 
        payments={[]} 
      /> */}
    </Suspense>
  );
}