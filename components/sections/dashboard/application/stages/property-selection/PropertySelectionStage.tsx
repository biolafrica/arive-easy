import { useProperties } from "@/hooks/useSpecialized";
import { PropertySelectionStageData, Props,} from "@/type/pages/dashboard/application";
import { useMemo, useState } from "react";
import { PropertyBase } from "@/type/pages/property";
import { PropertySelectionCard } from "@/components/cards/dashboard/SelectionProperty";
import { StatusBanner } from "./StatusBanner";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { FeaturedPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { formatUSD, toNumber } from "@/lib/formatter";


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

  const { properties = [], isLoading } = useProperties({
    filters: { status: 'active' }
  });

  const selectionData: PropertySelectionStageData = stageData || {
    status: '',
    reason: '',
    submitted_at: '',
    property_name: '',
    type: 'mortgage'
  };

  const submittedProperty = useMemo(() => {
    if (application.property_id) {
      return properties.find(p => p.id === application.property_id) || null;
    }
    return null;
  }, [application.property_id, properties]);

  const selectedProperty = useMemo(() => {
    if (selectedPropertyId) {
      return properties.find(p => p.id === selectedPropertyId) || null;
    }
    return null;
  }, [selectedPropertyId, properties]);

  const currentStatus = selectionData.status;
  const isSelectionMode = currentStatus === '' || currentStatus === 'declined';

  const handlePropertySelect = (propertyId: string) => {
    if (isReadOnly || !isSelectionMode) return;
    
    setSelectedPropertyId(prev => prev === propertyId ? null : propertyId);
  };

  const handleConfirmSelection = async () => {
    if (!selectedProperty) return;

    setIsSubmitting(true);
    try {
      await onUpdate({
        property_id: selectedProperty.id,
        property_name: selectedProperty.title,
        property_price: Number(selectedProperty.price),
        type: 'mortgage'
      });
      setSelectedPropertyId(null);
    } catch (error) {
      console.error('Failed to submit property selection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return ( <FeaturedPropertyGridSkeleton/> );
  }

  return (
    <div className="space-y-6">
      {currentStatus === 'sent' && (
        <StatusBanner propertyName={selectionData.property_name} variant="pending" />
      )}

      {currentStatus === 'approved' && (
        <StatusBanner propertyName={selectionData.property_name} variant="approved" />
      )}

      {currentStatus === 'declined' && (
        <StatusBanner 
          propertyName={selectionData.property_name} 
          reason={selectionData.reason}
          variant="declined"
        />
      )}

      {(currentStatus === 'sent' || currentStatus === 'approved') && submittedProperty ? (
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
              Choose the property you'd like to apply for a mortgage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {properties.map((property) => (
              <PropertySelectionCard
                key={property.id}
                property={property}
                isSelected={selectedPropertyId === property.id}
                onSelect={handlePropertySelect}
                formatPrice={()=>formatUSD({amount:toNumber(property.price),fromCents:false, decimals:2})}
                disabled={isReadOnly || isUpdating}
              />
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 text-secondary mx-auto mb-4" />
              <p className="text-secondary">No properties available at the moment.</p>
            </div>
          )}

          {selectedPropertyId && selectedProperty && (
            <div className="sticky bottom-4 mt-8">
              <div className="max-w-md mx-auto p-4 bg-card border border-border rounded-lg shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-secondary">Selected:</p>
                    <p className="font-medium text-heading truncate">
                      {selectedProperty.title}
                    </p>
                  </div>
                  <button
                    onClick={handleConfirmSelection}
                    disabled={isUpdating || isSubmitting}
                    className="shrink-0 px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating || isSubmitting ? 'Submitting...' : 'Confirm Selection'}
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