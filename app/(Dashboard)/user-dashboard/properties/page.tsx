"use client"

import { SegmentedTabs } from "@/components/common/SegmentedTabs";
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
    <div className="md:border rounded-lg md:bg-white p-1 md:p-10">

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

    </div>

  )
}