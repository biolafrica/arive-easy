'use client';

import { useState } from 'react';
import { ApplicationBase } from "@/type/pages/dashboard/application";
import { toast } from 'sonner';
import * as icon from '@heroicons/react/24/outline';
import { formatDate, formatUSD, toNumber } from '@/lib/formatter';
import Form from '@/components/form/Form';
import { DownPaymentForm, downPaymentField, downPaymentInitialValue } from '@/data/pages/dashboard/application';

interface DownPaymentSectionProps {
  application: ApplicationBase;
  paymentData: any;
  onUpdate: (data: any) => void;
  suggestedDownPayment: number;
  isReadOnly: boolean;
  isUpdating: boolean;
  isDownPaymentSufficient: boolean;
}

export function DownPaymentSection({
  application,
  paymentData,
  onUpdate,
  suggestedDownPayment,
  isReadOnly,
  isUpdating,
  isDownPaymentSufficient
}: DownPaymentSectionProps) {
  const [customAmount, setCustomAmount] = useState(paymentData.down_payment_amount);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownPayment = async (values:DownPaymentForm) => {

    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/payments/create-escrow-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: application.id,
          amount: values.down_payment,
          type: 'down_payment',
          seller_id: application.developer_id,
          property_id: application.property_id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create escrow payment session');
      }

      console.log("response", response)
      const { url } = await response.json();
      window.location.href = url;
      
    } catch (error) {
      console.error('Escrow payment error:', error);
      toast.error('Failed to initiate escrow payment');
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentData.down_payment_status) {
      case 'paid':
      case 'escrowed':
        return <icon.ShieldCheckIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <icon.ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <icon.BanknotesIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (paymentData.down_payment_status) {
      case 'escrowed':
        return 'Funds secured in escrow';
      case 'paid':
        return 'Payment completed';
      case 'pending':
        return 'Payment pending';
      default:
        return 'Payment required';
    }
  };

  const validate =(values:DownPaymentForm)=>{
    const errors: Partial<Record<keyof DownPaymentForm, string>> = {};

    if (!values.down_payment) {
      errors.down_payment = 'down payment is required';
    }else if(toNumber(values.down_payment) < toNumber(suggestedDownPayment)){
      errors.down_payment = `down payment should be at east ${application.down_payment_percentage}% of the property value `;
    }
    return errors;

  }


  return (
    <div className="bg-white rounded-lg border p-6">

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Down Payment</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-600">
            {getStatusText()}
          </span>
        </div>
      </div>

      {paymentData.down_payment_status !== 'escrowed' && !isReadOnly && (
        <div className="space-y-4">

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <icon.ShieldCheckIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Secure Escrow Protection
                </h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• Your funds are held securely until property transfer</li>
                  <li>• Seller cannot access funds until completion</li>
                  <li>• Full refund if transaction fails</li>
                  <li>• Transparent tracking for both parties</li>
                </ul>
              </div>
            </div>
          </div>

          <Form
            fields={downPaymentField}
            initialValues={downPaymentInitialValue}
            validate={validate}
            onSubmit={handleDownPayment}
            submitLabel={isProcessing ? 'Processing...' : `Pay ${formatUSD({amount:customAmount, fromCents:false, decimals:2})} to Escrow`}
            fullWidthSubmit={true}
          />

        </div>
      )}

      {paymentData.down_payment_status === 'escrowed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <icon.CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900">
                Down Payment Secured
              </h4>
              <p className="mt-1 text-sm text-green-700">
                {formatUSD({amount:paymentData.down_payment_amount, fromCents:false, decimals:2})} has been secured in escrow
              </p>
              {paymentData.down_payment_date && (
                <p className="text-xs text-green-600 mt-1">
                  Paid on {formatDate(paymentData.down_payment_date) }
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}