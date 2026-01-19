"use client"

import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import BrowsePropertyClientView from "@/components/sections/dashboard/property/user/BrowsePropertyClientView";
import MyPropertyClientView from "@/components/sections/dashboard/property/user/MyPropertyClientView";
import SavedPropertyClientView from "@/components/sections/dashboard/property/user/SavedPropertyClientView";
import { useState } from "react";

export default function UserDashboardProperties (){
  const TABS = [
    { id: 'my', label: 'My Properties' },
    { id: 'saved', label: 'Saved Properties' },
    { id: 'browse', label: 'Browse Properties' },
  ];

  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get("tab") ?? "my";

  const [tab, setTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setTab(value);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", value);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };


  return(
    <PageContainer>
      <SegmentedTabs
        tabs={TABS}
        active={tab}
        onChange={handleTabChange}
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