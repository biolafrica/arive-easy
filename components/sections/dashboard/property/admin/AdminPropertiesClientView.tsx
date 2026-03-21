'use client'

import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useState } from "react";
import AdminMortgageClientView from "./AdminMortgageCientView";
import AdminPropertyClientView from "./AdminPropertyClientView";
import SidePanel from "@/components/ui/SidePanel";
import AdminPropertyDetails from "./AdminPropertyDetails";
import AdminMortgageDetail from "./AdminMortgageDetail";
import AdminOfferClientView from "./AdminOfferClientView";

export const TABS = [
  { id: 'property', label: 'Property' },
  { id: 'mortgage', label: 'Mortgage' },
  { id: 'offers', label: 'Offers'},
];


export default function AdminPropertiesClientView(){
  const [tab, setTab] = useState('property');
  const detailPanel = useSidePanel<any>();


  const handleClose=()=>{
    detailPanel.close()
  }

  return(
    <div className="space-y-5">

      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title= {detailPanel.mode === 'edit' ? 'Property Details' : 'Mortgage Details'}
      >
        {detailPanel.mode === 'edit' && detailPanel.selectedItem ? 
          (<AdminPropertyDetails property={detailPanel.selectedItem} onClose={handleClose} />):
          (<AdminMortgageDetail mortgage ={detailPanel.selectedItem}/>)
        }
      </SidePanel>

      <div className="flex justify-center">
        <SegmentedTabs
          tabs={TABS}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'property' && (<AdminPropertyClientView detailPanel={detailPanel} /> )}
      {tab === 'mortgage' && (<AdminMortgageClientView  detailPanel={detailPanel} /> )}
      {tab === 'offers'  && (<AdminOfferClientView/>)}
    </div>
  )
}