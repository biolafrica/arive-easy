import { Mortgage, MortgagePayment } from "@/type/pages/dashboard/mortgage";
import { useEffect, useMemo, useState, useCallback } from "react";
import { NewPaymentMethodView, PaymentErrorView, PaymentMethodChoiceView, PaymentSelectView, PaymentSuccessView } from "./MakePaymentUtils";
import { formatUSD } from "@/lib/formatter";
import { Button } from "@/components/primitives/Button";
import { useMakePayment } from "@/hooks/useSpecialized/useMakePayment";


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
  onSuccess?: () => void;
}

type Step = 'select' | 'choose_method' | 'new_method' | 'processing' | 'success' | 'error';
export type PaymentMethodChoice = 'saved' | 'new';

export default function MakePaymentClientView({ 
  payments, 
  mortgage, 
  onClose, 
  onSuccess
}: MakePaymentClientViewProps) {
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<Set<string>>(new Set());

  const [step, setStep] = useState<Step>('select');

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const [paymentMethodChoice, setPaymentMethodChoice] = useState<PaymentMethodChoice>('saved');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);


  const { 
    fetchPaymentMethods,
    savedPaymentMethods,
    isFetchingMethods,
    createPayment,
    isCreating,
    payWithSavedMethod,
    handlePaymentAction,
    isProcessingAction,
    confirmPayment,
    isConfirming,
    error,
    clearError,
  } = useMakePayment();

  const paymentList = useMemo((): PaymentGroup[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return payments
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
          isOverdue: dueDate < today,
        };
      });
  }, [payments]);

  useEffect(() => {
    if (paymentList.length > 0 && selectedPaymentIds.size === 0) {
      const urgentPayment = paymentList.find(p => p.status === 'failed' || p.isOverdue);
      const firstPayment = urgentPayment || paymentList[0];

      if (firstPayment) {
        setSelectedPaymentIds(new Set([firstPayment.id]));
      }
    }
  }, [paymentList, selectedPaymentIds.size]); 

  const selectedPayments = useMemo(() => {
    return paymentList.filter(p => selectedPaymentIds.has(p.id));
  }, [paymentList, selectedPaymentIds]);

  const totalAmount = useMemo(() => {
    return selectedPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [selectedPayments]);

  
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



  const handleContinueToPayment = useCallback(async () => {
    if (selectedPayments.length === 0) return;
    clearError();
    
    const result = await fetchPaymentMethods(mortgage.id);
    
    // Auto-select the default method
    const defaultMethod = result.payment_methods?.find(m => m.isDefault);
    if (defaultMethod) {
      setSelectedPaymentMethodId(defaultMethod.id);
    } else if (result.payment_methods?.length > 0) {
      setSelectedPaymentMethodId(result.payment_methods[0].id);
    } else {
      // No saved methods, go directly to add new
      setPaymentMethodChoice('new');
    }
    
    setStep('choose_method');
  }, [selectedPayments.length, fetchPaymentMethods, mortgage.id, clearError]);

  const handlePayWithSavedMethod = useCallback(async () => {
    if (!selectedPaymentMethodId) return;
    clearError();

    try {
      const result = await payWithSavedMethod({
        mortgageId: mortgage.id,
        paymentIds: Array.from(selectedPaymentIds),
        paymentMethodId: selectedPaymentMethodId,
      });

      if (result.success && result.paymentIntentId) {
        // Payment succeeded immediately, confirm it
        setStep('processing');
        await confirmPayment({
          mortgageId: mortgage.id,
          paymentIntentId: result.paymentIntentId,
          paymentIds: Array.from(selectedPaymentIds),
        });
        setStep('success');
        onSuccess?.();
        return;
      }

      if (result.requiresAction && result.clientSecret && result.paymentIntentId) {
        // Handle 3DS or other action
        setStep('processing');
        const actionResult = await handlePaymentAction(result.clientSecret, result.paymentIntentId);
        
        if (actionResult.success && actionResult.paymentIntentId) {
          await confirmPayment({
            mortgageId: mortgage.id,
            paymentIntentId: actionResult.paymentIntentId,
            paymentIds: Array.from(selectedPaymentIds),
          });
          setStep('success');
          onSuccess?.();
        } else {
          setStep('error');
        }
      }
    } catch (err) {
      setStep('error');
    }
  }, [
    selectedPaymentMethodId,
    mortgage.id,
    selectedPaymentIds,
    payWithSavedMethod,
    confirmPayment,
    handlePaymentAction,
    clearError,
    onSuccess,
  ]);

  const handleInitiateNewMethod = useCallback(async () => {
    clearError();

    try {
      const result = await createPayment({
        mortgageId: mortgage.id,
        paymentIds: Array.from(selectedPaymentIds),
      });

      if (result?.client_secret) {
        setClientSecret(result.client_secret);
        setPaymentIntentId(result.payment_intent_id);
        setStep('new_method');
      }
    } catch (err) {
      // Error handled by hook
    }
  }, [createPayment, mortgage.id, selectedPaymentIds, clearError]);

  const handleNewMethodSuccess = useCallback(async (stripePaymentIntentId: string) => {
    setStep('processing');

    try {
      await confirmPayment({
        mortgageId: mortgage.id,
        paymentIntentId: stripePaymentIntentId,
        paymentIds: Array.from(selectedPaymentIds),
      });
      setStep('success');
      onSuccess?.();
    } catch (err) {
      setStep('error');
    }
  }, [confirmPayment, mortgage.id, selectedPaymentIds, onSuccess]);

  const handleRetry = useCallback(() => {
    clearError();
    setStep('choose_method');
  }, [clearError]);

  const isLoading = isCreating || isConfirming || isProcessingAction;


  return (
    <div className="flex flex-col h-full">
      
      <div className="flex-1 overflow-y-auto">
        {step === 'select' && (
          <PaymentSelectView
            paymentList={paymentList}
            selectedPaymentIds={selectedPaymentIds}
            togglePayment={togglePayment}
            selectAllUpTo={selectAllUpTo}
          />
        )}

        {step === 'choose_method' && (
          <PaymentMethodChoiceView
            savedMethods={savedPaymentMethods}
            selectedMethodId={selectedPaymentMethodId}
            onSelectMethod={setSelectedPaymentMethodId}
            paymentMethodChoice={paymentMethodChoice}
            onChoiceChange={setPaymentMethodChoice}
            isLoading={isFetchingMethods}
            onBack={() => setStep('select')}
            totalAmount={totalAmount}
            selectedPayments={selectedPayments}
          />
        )}

        {step === 'new_method' && clientSecret && (
          <NewPaymentMethodView
            clientSecret={clientSecret}
            totalAmount={totalAmount}
            selectedPayments={selectedPayments}
            onSuccess={handleNewMethodSuccess}
            onBack={() => setStep('choose_method')}
            mortgage={mortgage}
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
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">
                {selectedPayments.length} payment{selectedPayments.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-2xl font-bold text-gray-900">
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
            onClick={handleContinueToPayment}
            disabled={selectedPayments.length === 0 || isFetchingMethods}
            className="w-full"
            size="lg"
          >
            {isFetchingMethods ? 'Loading...' : 'Continue to Payment'}
          </Button>
        </div>
      )}

      {/* Footer - Step 2: Choose Method */}
      {step === 'choose_method' && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatUSD({ amount: totalAmount })}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {paymentMethodChoice === 'saved' ? (
            <Button
              onClick={handlePayWithSavedMethod}
              disabled={!selectedPaymentMethodId || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </span>
              ) : (
                `Pay ${formatUSD({ amount: totalAmount })}`
              )}
            </Button>
          ) : (
            <Button
              onClick={handleInitiateNewMethod}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Preparing...
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          )}
        </div>
      )}

    </div>
  );
}