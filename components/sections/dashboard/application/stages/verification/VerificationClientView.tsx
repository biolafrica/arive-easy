import { VerificationActionCard } from "./ActionCard";

export default function VerificationClientView({
  hasPaid,
}: {
  hasPaid: boolean;
}){
  const onPay=()=>{console.log("paid")}
  const onVerify=()=>{console.log("veified")}
  
  return(
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <VerificationActionCard
          title="Pay Verification Fee"
          description="Complete the one-time processing fee to unlock identity verification."
          actionLabel={hasPaid ? 'Payment Completed' : 'Pay $100'}
          onAction={onPay}
          disabled={hasPaid}
        />

        <VerificationActionCard
          title="Verify Your Identity"
          description="Verify your identity securely once payment is confirmed."
          actionLabel="Start Verification"
          onAction={onVerify}
          disabled={!hasPaid}
        />
      </div>
  )
}