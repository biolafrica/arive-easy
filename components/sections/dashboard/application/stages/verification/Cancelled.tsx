'use client';

import { Button } from "@/components/primitives/Button";
import { CANCELLED_PAYMENT_TYPES, CancelledPaymentType } from "@/data/pages/dashboard/transaction";
import * as icon from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCancelledPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentType = (searchParams.get('type') || 'processing_fee') as CancelledPaymentType;

  const paymentConfig = CANCELLED_PAYMENT_TYPES[paymentType] || CANCELLED_PAYMENT_TYPES.processing_fee;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">

          <div className="relative mb-6">
            <icon.XCircleIcon className="mx-auto h-20 w-20 text-red-500" />
            <div className={`absolute -bottom-2 -right-2 p-2 bg-white rounded-full border-2 border-white shadow-lg ${paymentConfig.bgColor}`}>
              <paymentConfig.icon className={`h-6 w-6 ${paymentConfig.iconColor}`} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {paymentConfig.title}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {paymentConfig.description}
          </p>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
            <div className="flex items-start space-x-3">
              <icon.ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">What this means:</h3>
                <ul className="space-y-1">
                  {paymentConfig.consequences.map((consequence, index) => (
                    <li key={index} className="flex items-start text-sm text-yellow-700">
                      <span className="text-yellow-500 mr-2">•</span>
                      {consequence}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {paymentType === 'escrow' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <icon.ShieldExclamationIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">About Escrow Payments</h4>
                  <p className="text-sm text-blue-700">
                    Escrow payments protect both buyers and sellers by holding funds securely until 
                    all conditions are met. Your payment is required to demonstrate commitment and 
                    secure the property.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/applications`)}
              className="w-full"
              size="lg"
            >
              {paymentConfig.retryText}
            </Button>
            
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/`)}
              variant="outline"
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you're experiencing payment issues or have questions about the {paymentType.replace('_', ' ')} process,
              our support team is here to help.
            </p>
            <div className="flex flex-col space-y-2">
              <a 
                href="mailto:support@ariveasy.com" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <icon.EnvelopeIcon className="h-4 w-4"/>
                Contact Support
              </a>

              <a 
                href="/help/payment-process" 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <icon.PhoneIcon className="h-4 w-4"/>
                Payment Help Center
              </a>

              {paymentType === 'escrow' && (
                <a 
                  href="/help/escrow-process" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  <icon.LockClosedIcon className="h-4 w-4"/>
                  Learn About Escrow
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 flex items-center justify-center">
                <icon.LockClosedIcon className="h-4 w-4"/>
                All payments are processed securely through our encrypted payment system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
