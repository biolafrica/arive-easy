'use client';

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { TabType } from "@/type/pages/dashboard/mortgage";
import { useRouter } from "next/navigation";
import * as icon from '@heroicons/react/24/outline';
import { formatDate,  } from "@/lib/formatter";
import { LoanDetailsSection, PaymentHistoryTable, ProgressSection, PropertyInfoSection, StatusBadge } from "./MortgageUtils";
import { useMortgage} from "@/hooks/useSpecialized/useMortgage";
import ErrorState from "@/components/feedbacks/ErrorState";
import { PropertyDetailsPageSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { StatsCard } from "@/components/cards/dashboard/StatsCard";
import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { statData } from "@/data/pages/dashboard/mortgage";

export default function MortgageClientView({ id }: { id: string }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const {mortgage, isLoading, error,refresh} = useMortgage(id, {
    include: ['properties'],
  })

  if (error) {
    return (
      <ErrorState
        message="Error loading mortgage details"
        retryLabel="Reload mortgage data"
        onRetry={refresh}
      />
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: icon.Squares2X2Icon },
    { id: 'payments', label: 'Payments', icon: icon.BanknotesIcon },
    { id: 'documents', label: 'Documents', icon: icon.DocumentTextIcon },
  ];



  return (
    <div>
      {isLoading && (<PropertyDetailsPageSkeleton/>) }
      {!isLoading && mortgage && mortgage.properties && (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Back Button */}
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <icon.ArrowLeftIcon className="w-4 h-4" />
                <span className="text-sm">Back to Mortgages</span>
              </button>

              {/* Title Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {mortgage?.properties?.title || 'Mortgage Details'}
                    </h1>
                    <StatusBadge status={mortgage?.status || 'active'} />
                  </div>
                  {mortgage?.properties && (
                    <p className="text-gray-500 mt-1 flex items-center gap-1">
                      <icon.MapPinIcon className="w-4 h-4" />
                      {mortgage.properties.address_full}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {mortgage?.status === 'active' && (
                    <Button 
                      leftIcon={<icon.CreditCardIcon className="w-4 h-4"/>} 
                    >
                      Make Payment
                    </Button>
                  )}
                  {mortgage?.status === 'payment_failed' && (
                    <Button 
                      variant='secondary' 
                      leftIcon={<icon.ExclamationTriangleIcon className="w-4 h-4"/>}
                    >
                      Update Payment Method
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-6 border-b border-gray-200 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'overview' && (

              <div className="space-y-6">
                <StatsGrid>
                  {statData(
                    (mortgage?.approved_loan_amount || 0) - ((mortgage?.payments_made || 0) * (mortgage?.monthly_payment || 0)),
                    mortgage?.next_payment_date ? formatDate(mortgage?.next_payment_date) : 'N/A',
                    mortgage?.last_payment_date,
                  ).map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <StatsCard
                        key={stat.id}
                        icon={<Icon className="h-6 w-6" />}
                        title={stat.title}
                        value={stat.value}
                      />
                    );
                  })}

                </StatsGrid>

                {/* Progress Section */}
                <ProgressSection mortgage={mortgage} />

                {/* Two Column Layout */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <LoanDetailsSection mortgage={mortgage} />
                  </div>
                  <div>
                    <PropertyInfoSection property={mortgage.properties} />
                  </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                    <button 
                      onClick={() => setActiveTab('payments')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <PaymentHistoryTable summary={true} id={mortgage.id} />
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                <PaymentHistoryTable summary={false} id={mortgage.id} />
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                <div className="text-center py-8 text-gray-500">
                  <icon.DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No documents available</p>
                  <p className="text-sm mt-1">Mortgage documents will appear here once available.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}