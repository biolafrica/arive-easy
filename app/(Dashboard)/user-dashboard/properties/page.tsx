"use client"

import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import BrowsePropertyClientView from "@/components/sections/dashboard/property/BrowsePropertyClientView";
import MyPropertyClientView from "@/components/sections/dashboard/property/MyPropertyClientView";
import SavedPropertyClientView from "@/components/sections/dashboard/property/SavedPropertyClientView";
import { useState } from "react";

export default function UserDashboardProperties (){
  const TABS = [
    { id: 'my', label: 'My Properties' },
    { id: 'saved', label: 'Saved Properties' },
    { id: 'browse', label: 'Browse Properties' },
  ];

  const [tab, setTab] = useState('my');

  return(
    <PageContainer>
      <SegmentedTabs
        tabs={TABS}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-5">
        {tab === 'my' ? 
          (<MyPropertyClientView/>) : tab === 'saved' ? 
          (<SavedPropertyClientView setTab ={setTab} />) :
          (<BrowsePropertyClientView/>) 
        }
      </div>
    </PageContainer>

  )
}