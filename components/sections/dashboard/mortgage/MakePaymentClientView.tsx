import { Mortgage, MortgagePayment } from "@/type/pages/dashboard/mortgage";
import { useEffect, useMemo, useState, useCallback } from "react";
import { PaymentConfirmView, PaymentErrorView, PaymentSelectView, PaymentSuccessView } from "./MakePaymentUtils";
import { formatUSD } from "@/lib/formatter";
import { Button } from "@/components/primitives/Button";
import { useMakePayment } from "@/hooks/useSpecialized/useMakePayment";

type Step = 'select' | 'confirm' | 'processing' | 'success' | 'error';

interface PaymentGroup {
  id: string;
  paymentNumber: number;
  amount: number;
  dueDate: string;
  status: 'failed' | 'scheduled';
  isOverdue: boolean;
}

interface MakePaymentClientViewProps {
  payments: MortgagePayment[];
  mortgage: Mortgage;
  onClose: () => void;
}

export default function MakePaymentClientView({ 
  payments, 
  mortgage, 
  onClose 
}: MakePaymentClientViewProps) {
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<Step>('select');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { 
    isCreating, 
    error, 
    isConfirming, 
    createPayment, 
    confirmPayment, 
    clearError 
  } = useMakePayment();


  const paymentList = useMemo((): PaymentGroup[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return payments
      .filter((p): p is MortgagePayment & { status: 'failed' | 'scheduled' } => 
        ['failed', 'scheduled'].includes(p.status)
      )
      .sort((a, b) => a.payment_number - b.payment_number)
      .map(p => {
        const dueDate = new Date(p.due_date);
        dueDate.setHours(0, 0, 0, 0);

        return {
          id: p.id,
          paymentNumber: p.payment_number,
          amount: p.amount,
          dueDate: p.due_date,
          status: p.status,
          isOverdue: dueDate < today,
        };
      });
  }, [payments]);

  const selectedPayments = useMemo(() => {
    return paymentList.filter(p => selectedPaymentIds.has(p.id));
  }, [paymentList, selectedPaymentIds]);

  const totalAmount = useMemo(() => {
    return selectedPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [selectedPayments]);


  useEffect(() => {
    if (paymentList.length > 0 && selectedPaymentIds.size === 0) {
      const urgentPayment = paymentList.find(p => p.status === 'failed' || p.isOverdue);
      const firstPayment = urgentPayment || paymentList[0];

      if (firstPayment) {
        setSelectedPaymentIds(new Set([firstPayment.id]));
      }
    }
  }, [paymentList]); 

  
  const togglePayment = useCallback((paymentId: string) => {
    setSelectedPaymentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paymentId)) {
        newSet.delete(paymentId);
      } else {
        newSet.add(paymentId);
      }
      return newSet;
    });
  }, []);

  const selectAllUpTo = useCallback((paymentId: string) => {
    const index = paymentList.findIndex(p => p.id === paymentId);
    if (index === -1) return;

    const newSet = new Set<string>();
    for (let i = 0; i <= index; i++) {
      newSet.add(paymentList[i].id);
    }
    setSelectedPaymentIds(newSet);
  }, [paymentList]);

  const handleInitiatePayment = async () => {
    clearError();
    
    try {
      const result = await createPayment({
        mortgageId: mortgage.id,
        paymentIds: Array.from(selectedPaymentIds),
      });

      if (result?.client_secret) {
        setClientSecret(result.client_secret);
        setStep('confirm');
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handlePaymentSuccess = async (stripePaymentIntentId: string) => {
    setStep('processing');

    try {
      await confirmPayment({
        mortgageId: mortgage.id,
        paymentIntentId: stripePaymentIntentId,
        paymentIds: Array.from(selectedPaymentIds),
      });
      setStep('success');
    } catch (err) {
      setStep('error');
    }
  };

  const handleRetry = () => {
    clearError();
    setStep('select');
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {step === 'select' && (
          <PaymentSelectView
            paymentList={paymentList}
            selectedPaymentIds={selectedPaymentIds}
            togglePayment={togglePayment}
            selectAllUpTo={selectAllUpTo}
            paymentMethodDisplay={mortgage.payment_method_display}
          />
        )}

        {step === 'confirm' && clientSecret && (
          <PaymentConfirmView
            clientSecret={clientSecret}
            totalAmount={totalAmount}
            selectedPayments={selectedPayments}
            onSuccess={handlePaymentSuccess}
            onBack={() => setStep('select')}
          />
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        )}

        {step === 'success' && (
          <PaymentSuccessView
            totalAmount={totalAmount}
            paymentCount={selectedPayments.length}
            onClose={onClose}
          />
        )}

        {step === 'error' && (
          <PaymentErrorView
            error={error}
            onRetry={handleRetry}
            onClose={onClose}
          />
        )}
      </div>

      {step === 'select' && (
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              {selectedPayments.length} payment{selectedPayments.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatUSD({ amount: totalAmount })}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleInitiatePayment}
            disabled={selectedPayments.length === 0 || isCreating}
            className="w-full"
            size="lg"
          >
            {isCreating ? 'Processing...' : `Pay ${formatUSD({ amount: totalAmount })}`}
          </Button>
        </div>
      )}
    </div>
  );
}