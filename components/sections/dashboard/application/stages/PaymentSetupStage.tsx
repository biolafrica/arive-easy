'use client';

import { useState, useEffect } from 'react';
import { ApplicationBase } from "@/type/pages/dashboard/application";
import { DownPaymentSection } from './payment-setup/DownPaymentSection';
import { LegalValuationFeesSection } from './payment-setup/LegalValuationFeesSection';
import {PaymentSummary } from './payment-setup/PaymentSummary';


interface Props {
  application: ApplicationBase;
  stageData?: PaymentSetupData; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

interface PaymentSetupData {
  down_payment_amount: number;
  down_payment_status: 'pending' | 'paid' | 'escrowed' | 'released' | 'refunded';
  down_payment_transaction_id?: string;
  down_payment_date?: string;
  legal_fee_amount?: number;
  legal_fee_status?: 'pending' | 'paid';
  legal_fee_transaction_id?: string;
  valuation_fee_amount?: number;
  valuation_fee_status?: 'pending' | 'paid';
  valuation_fee_transaction_id?: string;
  total_fees_paid: number;
}

export default function PaymentSetupStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props) {
  const [paymentData, setPaymentData] = useState<PaymentSetupData>({
    down_payment_amount: 0,
    down_payment_status: 'pending',
    legal_fee_amount: application.legal_fee || 0,
    legal_fee_status: 'pending',
    valuation_fee_amount: application.valuation_fee || 0,
    valuation_fee_status: 'pending',
    total_fees_paid: 0,
  });

  // Initialize from existing stage data
  useEffect(() => {
    if (stageData) {
      setPaymentData(prev => ({
        ...prev,
        ...stageData
      }));
    }
  }, [stageData]);

  // Calculate suggested down payment (from percentage)
  const suggestedDownPayment = Math.round(
    (application.property_price * application.down_payment_percentage) / 100
  );

  const remainingLoanAmount = application.property_price - paymentData.down_payment_amount;
  const isDownPaymentSufficient = paymentData.down_payment_amount >= suggestedDownPayment;

  const handleDownPaymentUpdate = (data: Partial<PaymentSetupData>) => {
    const updatedData = { ...paymentData, ...data };
    setPaymentData(updatedData);
    
    // Update stage completion status
    const isStageCompleted = 
    updatedData.down_payment_status === 'escrowed' &&
    (updatedData.legal_fee_amount === 0 || updatedData.legal_fee_status === 'paid') &&
    (updatedData.valuation_fee_amount === 0 || updatedData.valuation_fee_status === 'paid');

    onUpdate({
      completed: isStageCompleted,
      completed_at: isStageCompleted ? new Date().toISOString() : undefined,
      status: isStageCompleted ? 'completed' : 'in_progress',
      data: updatedData
    });
  };

  return (
    <div className="space-y-8">

      <PaymentSummary
        application={application}
        paymentData={paymentData}
        suggestedDownPayment={suggestedDownPayment}
        remainingLoanAmount={remainingLoanAmount}
      />

      <DownPaymentSection
        application={application}
        paymentData={paymentData}
        onUpdate={handleDownPaymentUpdate}
        suggestedDownPayment={suggestedDownPayment}
        isReadOnly={isReadOnly}
        isUpdating={isUpdating}
        isDownPaymentSufficient={isDownPaymentSufficient}
      />

      {(application.legal_fee > 0 || application.valuation_fee > 0) && (
        <LegalValuationFeesSection
          application={application}
          paymentData={paymentData}
          onUpdate={handleDownPaymentUpdate}
          isReadOnly={isReadOnly}
          isUpdating={isUpdating}
        />
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Stage Progress</span>
          <span className="font-medium">
            {paymentData.down_payment_status === 'escrowed' ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
}