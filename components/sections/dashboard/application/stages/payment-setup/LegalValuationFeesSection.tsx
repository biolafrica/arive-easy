'use client';

import { ApplicationBase } from "@/type/pages/dashboard/application";
import { Button } from '@/components/primitives/Button';
import { toast } from 'sonner';
import { ScaleIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { formatUSD } from "@/lib/formatter";

interface LegalValuationFeesSectionProps {
  application: ApplicationBase;
  paymentData: any;
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export function LegalValuationFeesSection({
  application,
  paymentData,
  onUpdate,
  isReadOnly,
  isUpdating
}: LegalValuationFeesSectionProps) {

  const handleFeePayment = async (type: 'legal' | 'valuation') => {
    const amount = type === 'legal' ? application.legal_fee : application.valuation_fee;
    
    if (amount <= 0) {
      toast.error(`${type} fee amount not set by admin`);
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: application.id,
          amount: amount,
          type: `${type}_fee`,
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} fee for property purchase`
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create ${type} fee payment session`);
      }

      const { url } = await response.json();
      window.location.href = url;
      
    } catch (error) {
      console.error(`${type} fee payment error:`, error);
      toast.error(`Failed to initiate ${type} fee payment`);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Fees</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legal Fee */}
        {application.legal_fee > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <ScaleIcon className="h-6 w-6 text-blue-500" />
              <h4 className="font-medium text-gray-900">Legal Fee</h4>
            </div>
            
            <p className="text-2xl font-bold text-gray-900 mb-2">
             {formatUSD({amount:application.legal_fee, fromCents:false, decimals:2})}
            </p>
            
            <p className="text-sm text-gray-600 mb-4">
              Legal processing and documentation fees
            </p>

            {paymentData.legal_fee_status === 'paid' ? (
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-sm">
                ✓ Paid
              </div>
            ) : (
              <Button
                onClick={() => handleFeePayment('legal')}
                disabled={isReadOnly || isUpdating}
                className="w-full"
              >
                Pay Legal Fee
              </Button>
            )}
          </div>
        )}

        {/* Valuation Fee */}
        {application.valuation_fee > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <DocumentMagnifyingGlassIcon className="h-6 w-6 text-purple-500" />
              <h4 className="font-medium text-gray-900">Valuation Fee</h4>
            </div>
            
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatUSD({amount:application.valuation_fee, fromCents:false, decimals:2})}
            </p>
            
            <p className="text-sm text-gray-600 mb-4">
              Property valuation and assessment fees
            </p>

            {paymentData.valuation_fee_status === 'paid' ? (
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-sm">
                ✓ Paid
              </div>
            ) : (
              <Button
                onClick={() => handleFeePayment('valuation')}
                disabled={isReadOnly || isUpdating}
                className="w-full"
              >
                Pay Valuation Fee
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Admin Notice */}
      {(application.legal_fee === 0 && application.valuation_fee === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Additional fees will appear here once set by the administrator.
          </p>
        </div>
      )}
    </div>
  );
}