import { useApplicationProperties} from "@/hooks/useSpecialized";
import { PropertySelectionStageData, Props,} from "@/type/pages/dashboard/application";
import { useState } from "react";
import { PropertyBase } from "@/type/pages/property";
import { PropertySelectionCard } from "@/components/cards/dashboard/SelectionProperty";

import { formatUSD, toNumber } from "@/lib/formatter";
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import PropertyStageStatusBanner from "./PropertyStageStatusBanner";
import { PropertySelectionList } from "./PropertySelectionList";


function SelectedPropertyView({  property,status
}: { 
  property: PropertyBase;
  status: 'sent' | 'approved';
}) {

  return (
    <div className="max-w-2xl mx-auto">
      <PropertySelectionCard
        property={property}
        isSelected={true}
        onSelect={() => {}} // No action - read only
        formatPrice={()=>formatUSD({amount:toNumber(property.price),fromCents:false, decimals:2})}
        disabled={true}
      />
    </div>
  );
}

export default function PropertySelectionStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly = false,
  isUpdating = false
}: Props) {

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userBuyingPower = 500000 // change to selected property price later

  const { property: submittedProperty, isLoading, mode} = useApplicationProperties(
    application.property_id,
    userBuyingPower
  );

  const selectionData: PropertySelectionStageData = stageData || {
    status: '',
    reason: '',
    submitted_at: '',
    property_name: '',
    type: 'mortgage'
  };

  const currentStatus = selectionData.status;
  const isSelectionMode = currentStatus === '' || currentStatus === 'declined';

  const handlePropertySelect = (propertyId: string) => {
    if (isReadOnly || !isSelectionMode) return;
    
    setSelectedPropertyId(prev => prev === propertyId ? null : propertyId);
  };

  const handleConfirmSelection = async () => {
    if (!selectedPropertyId) return;

    setIsSubmitting(true);
    try {
      await onUpdate({
        property_id: selectedPropertyId,
        property_name: '',
        property_price: 0,
        type: 'mortgage',
        developer_id: ""
      });
      setSelectedPropertyId(null);
    } catch (error) {
      console.error('Failed to submit property selection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading ) {
    return ( <AllPropertyGridSkeleton/> );
  }

  const shouldShowSubmittedProperty = 
  (currentStatus === 'sent' || currentStatus === 'approved') && 
  mode === 'single' && submittedProperty;

  return (
    <div className="space-y-6">

      <PropertyStageStatusBanner 
        status={currentStatus} 
        propertyName={selectionData.property_name} 
        reason={selectionData.reason}
      />

      {shouldShowSubmittedProperty ? (
        <SelectedPropertyView 
          property={submittedProperty} 
          status={currentStatus}
        />
      ) : (
        <>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-heading">
              {currentStatus === 'declined' ? 'Select Another Property' : 'Select Your Property'}
            </h2>

            <p className="mt-2 text-secondary">
              Choose a property within your approved budget of{' '}
              <span className="font-semibold">
                {formatUSD({
                  amount: application.approved_loan_amount || 500000,
                  fromCents: false,
                  decimals: 0
                })}
              </span>
            </p>
          </div>

          <PropertySelectionList
            applicationPropertyId={application.property_id}
            userBuyingPower={userBuyingPower}
            selectedPropertyId={selectedPropertyId}
            onSelect={handlePropertySelect}
            isReadOnly={isReadOnly}
            isUpdating={isUpdating}
          />

          {selectedPropertyId && (
            <div className="sticky bottom-4 mt-8">
              <div className="max-w-md mx-auto p-4 bg-card border border-border rounded-lg shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-secondary">Ready to confirm?</p>
                    <p className="text-xs text-secondary/70 truncate">
                      1 property selected
                    </p>
                  </div>
                  <button
                    onClick={handleConfirmSelection}
                    disabled={isUpdating || isSubmitting}
                    className="shrink-0 px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating || isSubmitting ? 'Submitting…' : 'Confirm Selection'}
                  </button>
                </div>
              </div>
            </div>
          )}
 

        </>
      )}

    </div>
  );
}