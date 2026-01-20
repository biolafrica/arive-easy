'use client'

import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { useState } from "react";
import AdminPreApprovalClientView from "./AdminPreApprovalClientView";
import AdminPreMortgageClientView from "./AdminPreMortgageClientView";
import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import AdminPreApprovalDetails from "./AdminPreApprovalDetails";
import AdminPreMortgageDetails from "./AdminPreMortgageDetails";

export const TABS = [
  { id: 'pre_approval', label: 'Pre Approval' },
  { id: 'pre_mortgage', label: 'Pre Mortgage' },
];

export default function AdminApplicationsClientView (){
  const [tab, setTab] = useState('pre_approval');
  const detailPanel = useSidePanel<any>();

  const handleClose=()=>{
    detailPanel.close()
  }
  
  return(
    <div className="space-y-5">

      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title= {detailPanel.mode === 'edit' ? 'Pre Approval Details' : 'Pre Mortgage Details'}
      >
        {detailPanel.mode === 'edit' && detailPanel.selectedItem ? 
          (<AdminPreApprovalDetails pre_approvals={detailPanel.selectedItem} close={handleClose} />):
          (<AdminPreMortgageDetails applications={detailPanel.selectedItem} />)
        }
      </SidePanel>

      <div className="flex justify-center">
        <SegmentedTabs
          tabs={TABS}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'pre_approval' && (<AdminPreApprovalClientView detailPanel={detailPanel} close={detailPanel.close}/> )}
      {tab === 'pre_mortgage' && (<AdminPreMortgageClientView detailPanel={detailPanel}/> ) }
      
    </div>
  )
}