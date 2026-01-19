'use client';

import { Button } from "@/components/primitives/Button";
import { DashboardPageHeader } from "../property/seller/SellerPropertyHeader";
import { PROPERTY_STATS, PropertyListingCard } from "@/components/cards/dashboard/SellerProperty";

export default function SellerDashboardListingsClientView (){
  return(
    <div className="space-y-5">
    
      <DashboardPageHeader
        title="My Listings"
        description="View and manage your active properties."
        onSearch={(value) => console.log(value)}
        filters={
          <select className="rounded-lg border border-border bg-background pl-4 py-2 text-sm">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Closed</option>
          </select>
        }
        action={<Button>Upload Properties</Button>}
      />
    
      <div className="grid lg:grid-cols-2 gap-5">

        <PropertyListingCard
          image="/images/house-1.jpg"
          title="123 Palm Drive, Lekki, Lagos"
          price="$250,000,000"
          stats={PROPERTY_STATS}
          badges={[
            { label: 'Active', variant: 'success' },
            { label: 'Funded', variant: 'success' },
          ]}
          onMenuClick={() => console.log('menu clicked')}
        />

        <PropertyListingCard
          image="/images/house-1.jpg"
          title="123 Palm Drive, Lekki, Lagos"
          price="$250,000,000"
          stats={PROPERTY_STATS}
          badges={[
            { label: 'Active', variant: 'success' },
            { label: 'Funded', variant: 'success' },
          ]}
          onMenuClick={() => console.log('menu clicked')}
        />

        <PropertyListingCard
          image="/images/house-1.jpg"
          title="123 Palm Drive, Lekki, Lagos"
          price="$250,000,000"
          stats={PROPERTY_STATS}
          badges={[
            { label: 'Active', variant: 'success' },
            { label: 'Funded', variant: 'success' },
          ]}
          onMenuClick={() => console.log('menu clicked')}
        />

      </div>

    </div>
    
  )
}