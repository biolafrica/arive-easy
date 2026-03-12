'use client';

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { TabType } from "@/type/pages/dashboard/mortgage";
import * as icon from '@heroicons/react/24/outline';
import * as utils from "./MortgageUtils";
import { useMortgage} from "@/hooks/useSpecialized/useMortgage";
import ErrorState from "@/components/feedbacks/ErrorState";
import { PropertyDetailsPageSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import {tabs } from "@/data/pages/dashboard/mortgage";
import { BackButton } from "@/components/primitives/BackButton";
import MortgageDocuments from "./MortgageDocuments";
import { useSidePanel } from "@/hooks/useSidePanel";
import SidePanel from "@/components/ui/SidePanel";
import MakePaymentDetails from "./MakePaymentDetails";
import MortgagePaymentTable from "./MortgagePaymentTable";
import OverviewDetails from "./OverviewDetails";

export default function MortgageClientView({ id }: { id: string }) {

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const detailPanel = useSidePanel<any>();

  const {item:mortgage, isLoading, error, refresh} = useMortgage(id, {
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

  return (
    <>
      {!isLoading && mortgage && (
        <SidePanel
          isOpen={detailPanel.isOpen}
          onClose={detailPanel.close}
          title="Make a Payment (Select payments to process)"
        >
          {detailPanel.selectedItem && (
            <MakePaymentDetails
              mortgage={mortgage} 
              close={detailPanel.close}
            />
          )}

        </SidePanel>
      )}

      <div>
        
        {isLoading && (<PropertyDetailsPageSkeleton/>) }

        {!isLoading && mortgage && mortgage.properties && (
          <div className="min-h-screen bg-gray-50">
            
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <BackButton label="Back to mortgages" className="mb-2" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {mortgage?.properties?.title || 'Mortgage Details'}
                      </h1>

                      <utils.StatusBadge status={mortgage?.status || 'active'} />

                    </div>

                    {mortgage?.properties && (
                      <p className="text-gray-500 mt-1 flex items-center gap-1">
                        <icon.MapPinIcon className="w-4 h-4" />
                        {mortgage.properties.address_full}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">

                    {mortgage?.status === 'active' && (
                      <Button 
                        leftIcon={<icon.CreditCardIcon className="w-4 h-4"/>} 
                        onClick={detailPanel.openView}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

              {activeTab === 'overview' && (

                <OverviewDetails 
                  mortgage={mortgage} 
                  setActiveTab={()=>setActiveTab('payments')} 
                  property={mortgage.properties}  
                />
              )}

              {activeTab === 'payments' && (
                <MortgagePaymentTable id={mortgage.id} />
              )}

              {activeTab === 'documents' && (
                <MortgageDocuments id={mortgage.application_id} />
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}