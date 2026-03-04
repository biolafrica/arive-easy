import { useMortgagePayments } from "@/hooks/useSpecialized/useMortgagePayment";
import MakePaymentClientView from "./MakePaymentClientView";
import ErrorState from "@/components/feedbacks/ErrorState";
import { Mortgage } from "@/type/pages/dashboard/mortgage";

interface MakePaymentDetailsProps {
  mortgage: Mortgage;
  close: () => void;
}

export default function MakePaymentDetails({mortgage, close}: MakePaymentDetailsProps){

  const {mortgagePayments, isLoading, error, refresh} = useMortgagePayments({
    filters: {
      mortgage_id: mortgage.id,
    },
  })

  if(isLoading){
    return (
      <div className="p-4">
        Loading mortgage payment details...
      </div>
    );
  }

  if(error){
    return (
      <ErrorState
        message="Error loading mortgage payment"
        retryLabel="Reload mortgage payment data"
        onRetry={refresh}
      />
    );
  }

  const handleClose = () => {
    close();
  }

  return(
    <div>
      <MakePaymentClientView 
        payments={mortgagePayments} 
        mortgage={mortgage} 
        onClose={handleClose}
      />

    </div>
  )
}