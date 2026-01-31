import { Button } from "@/components/primitives/Button";
import { PropertyAmenities } from "@/components/sections/public/property/PropertyAmenities";
import PropertyDescription from "@/components/sections/public/property/PropertyDescription";
import { PropertyDetails } from "@/components/sections/public/property/PropertyDetails";
import { PropertyGallery } from "@/components/sections/public/property/PropertyGallery";
import { PropertyPricing } from "@/components/sections/public/property/PropetyPricing";
import { PropertyBase } from "@/type/pages/property";
import PropertyDocumentsList from "./PropertyDocumentList";
import { useState } from "react";
import ConfirmBanner, { BannerVariant } from "@/components/feedbacks/ConfirmBanner";
import { useAdminPropertyActions } from "@/hooks/useSpecialized";
import { useConfirmAction } from "@/hooks/useConfirmation";
import { confirmConfig } from "@/data/pages/dashboard/property";

interface Props {
  property: PropertyBase;
  onClose: ()=>void
}

export interface Banner{
  title: string;
  message:string;
  variant: BannerVariant;
  confirm :  () => void;

}

export default function AdminPropertyDetails ({ property, onClose }: Props){
  const { toggleApproval, toggleFeature, isUpdating } = useAdminPropertyActions();

  const handleType = async(type: 'approval' | 'feature')=>{
    type === 'approval' ?
    await toggleApproval(property.id, property.is_active):
    await toggleFeature(property.id, property.is_featured);
    setTimeout(()=>{
      onClose()
    }, 1500)

  }
  const { open, banner, openConfirm, closeConfirm,} = useConfirmAction(confirmConfig, handleType);

  return(
    <>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-semibold text-heading"> {property.title} </h1>
          <p className="mt-1 text-sm text-secondary">{property.address_full}</p>
        </div>

        <div className="space-y-4">
          <div className="lg:col-span-2 space-y-6">
            <PropertyGallery
              images={property.images}
              tours={property.tours}
            />
          </div>

          <PropertyPricing
            price={property.price}
            deposit={property.deposit}
            down_payment={property.down_payment}
            payment_period={property.payment_period}
            interest_rate={property.interest_rate}
          />

          <PropertyDetails
            address_full={property.address_full}
            area_sqm={property.area_sqm}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            property_type={property.property_type}
            interior={property.interior}
          />

          <PropertyDescription description={property.description}
          />

          <PropertyAmenities
            amenities={property.amenities}
          />

          <PropertyDocumentsList/>

        </div>

        <div className="flex gap-5">

          <Button onClick={()=>openConfirm('approval')} disabled={isUpdating}>
            {property.is_active ? "UnApprove" : "Approve"} Property
          </Button>

          <Button 
            onClick={()=>openConfirm('feature')} 
            variant="secondary" 
            disabled={isUpdating}
          >
            {property.is_featured ? "Remove from" : "Add to"} Feature
          </Button>
        
        </div>

      </div>

      {banner && (
        <ConfirmBanner
          open={open}
          title={banner.title}
          message={banner.message}
          variant={banner.variant}
          onConfirm={banner.confirm}
          onCancel={closeConfirm}
        />
      )}

    </>

  )
}
