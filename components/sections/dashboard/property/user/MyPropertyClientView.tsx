import { useAuthContext } from "@/providers/auth-provider";
import { useMortgages } from "@/hooks/useSpecialized/useMortgage";
import ErrorState from "@/components/feedbacks/ErrorState";
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { NoActiveMortgageState } from "./PropertyEmptyState";
import { MortgageCard } from "@/components/cards/dashboard/Mortgage";

export default function MyPropertyClientView() {
  const { user, loading: isUserLoading } = useAuthContext();
  
  const { mortgages, isLoading, error, refresh } = useMortgages({
    filters: {
      user_id: user?.id, 
    }
  });

  if (!user) return null;

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
    <div>
      {isLoading && <AllPropertyGridSkeleton />}
      {!isLoading && mortgages.length === 0 && (<NoActiveMortgageState />)}
      {mortgages && mortgages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mortgages.map((item) => (
            <MortgageCard
              key={item.id}
              mortgage={item}
              onMakePayment={() => handleMakePayment(item.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}