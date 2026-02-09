import { MortgageCard } from "@/components/cards/dashboard/Mortgage";
import { useMortgages } from "@/hooks/useSpecialized/useMortgage";
import { useAuthContext } from "@/providers/auth-provider";
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { NoActiveMortgageState } from "./PropertyEmptyState";
import ErrorState from "@/components/feedbacks/ErrorState";

export default function MyPropertyClientView(){
  const { user} = useAuthContext();

  const {mortgages, isLoading, error , refresh} = useMortgages({
    include: ['properties'],
    filters: {
      user_id: user?.id,
    }
  })

  const handleMakePayment = (mortgageId: string) => {
    console.log('Make payment for mortgage:', mortgageId);
  };

  if (error) {
    return (
      <ErrorState
        message="Error loading mortgages"
        retryLabel="Reload data"
        onRetry={refresh}
      />
    );
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {isLoading && <AllPropertyGridSkeleton/>}

      {!isLoading && mortgages.length === 0 && (<NoActiveMortgageState/>)}

      { mortgages && mortgages.length > 0 && (
        mortgages.map((item) => (
          <MortgageCard
            key={item.id} 
            mortgage={item} 
            onMakePayment={()=>handleMakePayment}
          />
        ))
      )}

    </div>
  );
}