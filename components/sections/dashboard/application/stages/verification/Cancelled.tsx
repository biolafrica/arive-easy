'use client';

import { Button } from "@/components/primitives/Button";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";


export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was not completed. You can retry the payment 
            to continue with your mortgage application.
          </p>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/applications`)}
              className="w-full"
            >
              Retry Payment
            </Button>
            
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/`)}
              variant="outline"
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
