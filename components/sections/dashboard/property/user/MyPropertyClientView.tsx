
import { Mortgage, MortgageForm } from "@/type/pages/dashboard/mortgage";
import { MortgageCardSkeleton } from "./MortgageSkeleton";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { MortgageCard } from "@/components/cards/dashboard/Mortgage";

export default function MyPropertyClientView(){
  const mortgages: MortgageForm[] = [
    {
      id: '1',
      status: 'active',
      property_price: 50000,
      approved_loan_amount: 380000000,
      interest_rate_annual: 6.7,
      monthly_payment: 100,
      payments_made: 1,
      total_payments: 55000,
      next_payment_date: '2026-02-05 21:57:16.512893+00',
      last_payment_date: '2026-02-05 21:57:16.512893+00',
      property:{
        title: 'Mary Keyes Residence',
        address_full: '123 Mary Keyes Street, Utako, Abuja',
        status: 'active',
      }
    }
  ]

  const isLoading = false;

  const handleMakePayment = (mortgageId: string) => {
    console.log('Make payment for mortgage:', mortgageId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <MortgageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (mortgages.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No mortgages yet</h3>
        <p className="text-gray-500 mb-4">Start your property journey by applying for a mortgage.</p>
        <Link href="/user-dashboard/applications">
          <Button>Start Application</Button>
        </Link>
      </div>
    );
  }

  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {mortgages.map((item) => (
        <MortgageCard
          key={item.id} 
          mortgage={item} 
          onMakePayment={()=>handleMakePayment}
        />
      ))}
    </div>
  );
}