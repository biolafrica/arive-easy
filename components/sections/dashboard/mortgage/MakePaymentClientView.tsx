import { Mortgage, MortgagePayment } from "@/type/pages/dashboard/mortgage";
import { useEffect, useMemo, useState } from "react";
import { PaymentConfirmView, PaymentErrorView, PaymentSelectView, PaymentSuccessView } from "./MakePaymentUtils";
import { formatUSD } from "@/lib/formatter";
import { Button } from "@/components/primitives/Button";

type Step = 'select' | 'confirm' | 'processing' | 'success' | 'error';

export default function MakePaymentClientView({payments, mortgage, onClose}:{
  payments:MortgagePayment[]
  mortgage: Mortgage 
  onClose: () => void
}){

  const [selectedPaymentIds, setSelectedPaymentIds] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<Step>('select');
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const paymentList = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const payablePayments = payments
      .filter(p => ['failed', 'scheduled'].includes(p.status))
      .sort((a, b) => a.payment_number - b.payment_number)
      .map(p => {
        const dueDate = new Date(p.due_date);
        dueDate.setHours(0, 0, 0, 0);
        
        return {
          id: p.id,
          paymentNumber: p.payment_number,
          amount: p.amount,
          dueDate: p.due_date,
          status: p.status as 'failed' | 'scheduled',
          isOverdue: dueDate < today && p.status !== 'succeeded',
          isSelected: false,
        };
      });

    return payablePayments;
  }, [payments]);

  useEffect(() => {
    if (paymentList.length > 0) {
      const urgentPayment = paymentList.find(p => p.status === 'failed' || p.isOverdue);
      const firstPayment = urgentPayment || paymentList[0];
      
      if (firstPayment) {
        setSelectedPaymentIds(new Set([firstPayment.id]));
      }
    }
  }, [paymentList]);

  useEffect(() => {
    setSelectedPaymentIds(new Set());
    setStep('select');
    setSelectedPaymentIds(new Set());
    setClientSecret(null);
    setError(null);
    setPaymentIntentId(null);
  }, []);

  const togglePayment = (paymentId: string) => {
    setSelectedPaymentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paymentId)) {
        newSet.delete(paymentId);
      } else {
        newSet.add(paymentId);
      }
      return newSet;
    });
  };

  const selectedPayments = useMemo(() => {
    return paymentList.filter(p => selectedPaymentIds.has(p.id));
  }, [paymentList, selectedPaymentIds]);

  const totalAmount = useMemo(() => {
    return selectedPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [selectedPayments]);


  const selectAllUpTo = (paymentId: string) => {
    const index = paymentList.findIndex(p => p.id === paymentId);
    if (index === -1) return;

    const newSet = new Set<string>();
    for (let i = 0; i <= index; i++) {
      newSet.add(paymentList[i].id);
    }
    setSelectedPaymentIds(newSet);
  };

  const handleInitiatePayment = async () => {
    console.log('Initiating payment for IDs:', Array.from(selectedPaymentIds));
  }

  const handlePaymentSuccess = async (stripePaymentIntentId: string) => {
    console.log('Payment succeeded with Stripe Payment Intent ID:', stripePaymentIntentId);
  }

  return(
    <div>

      <div className="flex-1 overflow-y-auto">

        {step === 'select' && (
          <PaymentSelectView
            paymentList={paymentList}
            selectedPaymentIds={selectedPaymentIds}
            togglePayment={togglePayment}
            selectAllUpTo={selectAllUpTo}
            mortgage={mortgage}
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
            onRetry={() => setStep('select')}
            onClose={onClose}
          />
        )}

        {step === 'select' && (
          <div className=" p-6 ">
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-sm text-secondary">
                  {selectedPayments.length} payment{selectedPayments.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-2xl font-bold text-text">
                  {formatUSD({ amount: totalAmount })}
                </p>
              </div>
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
              Pay {formatUSD({ amount: totalAmount })}

            </Button>

          </div>
        )}

      </div>

    </div>
  )
}