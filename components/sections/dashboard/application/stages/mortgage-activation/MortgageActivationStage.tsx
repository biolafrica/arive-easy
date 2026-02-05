'use client';

import { useEffect, useState, useCallback } from "react";
import { ApplicationBase } from "@/type/pages/dashboard/application";
import { ReviewStep, SetupStep } from "./MortgageUtilsComponents";
import { useDirectDebitSetup } from "@/hooks/useDirectDebitSetup";
import { DirectDebitPaymentForm } from "./DirectDebitPaymentForm";
import { DirectDebitSuccess } from "./DirectDebitSuccess";

// ============================================
// TYPES
// ============================================

export interface MortgageActivationData {
  direct_debit_status: 'not_started' | 'pending_setup' | 'pending_verification' | 'active' | 'paused' | 'cancelled';
  direct_debit_creation_date?: string;
  documents_signed: boolean;
  client_secret?: string;
  mortgage_id?: string;
  setup_intent_id?: string;
  current_step?: SetupStep;
}

interface Props {
  application: ApplicationBase;
  stageData?: MortgageActivationData;
  onUpdate: (data: Partial<MortgageActivationData>) => Promise<void>;
  isReadOnly: boolean;
  isUpdating: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function MortgageActivationStage({
  application,
  stageData,
  onUpdate,
  isReadOnly,
  isUpdating
}: Props) {
  // Initialize state from stageData (persisted) or defaults
  const [currentStep, setCurrentStep] = useState<SetupStep>(
    stageData?.current_step || 'review'
  );
  const [clientSecret, setClientSecret] = useState<string | null>(
    stageData?.client_secret || null
  );

  const {
    initiateSetup,
    isInitiating,
    confirmSetup,
    isConfirming,
    error,
    clearError
  } = useDirectDebitSetup();

  // ============================================
  // RESTORE STATE FROM STAGE DATA
  // ============================================
  
  useEffect(() => {
    // If direct debit is already active, show success
    if (application.direct_debit_status === 'active' || stageData?.direct_debit_status === 'active') {
      setCurrentStep('success');
      return;
    }

    // If we have a client_secret saved, restore the payment_method step
    if (stageData?.client_secret && stageData?.current_step === 'payment_method') {
      setClientSecret(stageData.client_secret);
      setCurrentStep('payment_method');
      return;
    }

    // If pending_verification, show success (waiting for webhook)
    if (stageData?.direct_debit_status === 'pending_verification') {
      setCurrentStep('success');
      return;
    }

    // Otherwise use the saved current_step or default to review
    if (stageData?.current_step) {
      setCurrentStep(stageData.current_step);
    }
  }, [application.direct_debit_status, stageData]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleInitiateSetup = async () => {
    try {
      clearError();
      
      const result = await initiateSetup({
        application_id: application.id,
        user_country: 'CA',
      });

      if (result?.client_secret) {
        // Save to state
        setClientSecret(result.client_secret);
        setCurrentStep('payment_method');
      }
    } catch (err) {
      console.error('Failed to initiate setup:', err);
    }
  };

  const handleConfirmSetup = useCallback(async (
    setupIntentId: string,
    paymentMethodId: string,
    status: 'succeeded' | 'processing'
  ) => {
    try {
      // Call the confirm endpoint via hook
      await confirmSetup({
        application_id: application.id,
        setup_intent_id: setupIntentId,
        payment_method_id: paymentMethodId,
      });

      // Determine the direct debit status based on Stripe's response
      // 'processing' = bank debit is being verified asynchronously
      // 'succeeded' = card or instant verification completed
      const directDebitStatus = status === 'succeeded' ? 'active' : 'pending_verification';

      // Update stage data
      await onUpdate({
        direct_debit_status: directDebitStatus,
        direct_debit_creation_date: new Date().toISOString(),
        current_step: 'success',
        // Clear client_secret as it's no longer needed
        client_secret: undefined,
      });

      // Move to success step
      setCurrentStep('success');

    } catch (err) {
      console.error('Failed to confirm setup:', err);
      throw err; // Re-throw so the form can handle the error
    }
  }, [application.id, confirmSetup, onUpdate]);

  const handleBack = useCallback(async () => {
    setCurrentStep('review');
    
    // Optionally persist the step change
    await onUpdate({
      current_step: 'review',
    });
  }, [onUpdate]);

  // ============================================
  // LOAN DETAILS
  // ============================================

  const loanDetails = {
    loanAmount: application.approved_loan_amount || 0,
    monthlyPayment: application.monthly_payment || 0,
    totalPayments: application.total_payment || 0,
    firstPaymentDate: application.first_payment_date,
    lastPaymentDate: application.last_payment_date,
    paymentDayOfMonth: application.payment_day_of_month || 1,
    interestRate: application.interest_rate || 0,
  };

  // ============================================
  // RENDER
  // ============================================

  // Show processing message if pending verification
  const isPendingVerification = stageData?.direct_debit_status === 'pending_verification';

  return (
    <div className="space-y-6 mt-5">
      {currentStep === 'review' && (
        <ReviewStep
          loanDetails={loanDetails}
          onProceed={handleInitiateSetup}
          isLoading={isInitiating || isUpdating}
          error={error}
        />
      )}

      {currentStep === 'payment_method' && clientSecret && (
        <DirectDebitPaymentForm
          clientSecret={clientSecret}
          applicationId={application.id}
          userCountry='CA'
          monthlyAmount={loanDetails.monthlyPayment}
          onConfirm={handleConfirmSetup}
          onBack={handleBack}
          isConfirming={isConfirming}
        />
      )}

      {currentStep === 'success' && (
        <DirectDebitSuccess
          loanDetails={loanDetails}
          applicationId={application.id}
          isPendingVerification={isPendingVerification}
        />
      )}
    </div>
  );
}