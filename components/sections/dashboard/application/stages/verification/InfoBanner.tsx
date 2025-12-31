import { CheckCircleIcon } from '@heroicons/react/24/solid';

export function VerificationFeeInfo() {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 space-y-4">
      <p className="text-sm sm:text-base text-heading">
        To finalize your application, we need to verify your identity and the
        information you’ve provided.
      </p>

      <p className="text-sm sm:text-base text-heading">
        A one-time, non-refundable processing fee of{' '}
        <span className="font-semibold text-lg">$100</span> is required.
      </p>

      <div className="space-y-2">
        <p className="font-medium text-heading">This fee covers:</p>

        <ul className="space-y-2 text-sm text-secondary">
          {[
            'Identity & Document Verification',
            'Credit Report Verification',
            'Secure document handling & fraud prevention',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-orange-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs sm:text-sm text-secondary pt-2">
        Your information is protected by bank-level security standards.
        You’ll be redirected to begin verification immediately after payment.
      </p>
    </div>
  );
}
