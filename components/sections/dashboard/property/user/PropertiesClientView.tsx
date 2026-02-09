'use client'
import { useState, useEffect, Suspense } from "react";
import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import MyPropertyClientView from "./MyPropertyClientView";
import SavedPropertyClientView from "./SavedPropertyClientView";
import BrowsePropertyClientView from "./BrowsePropertyClientView";

export const TABS = [
  { id: 'my', label: 'My Properties' },
  { id: 'saved', label: 'Saved Properties' },
  { id: 'browse', label: 'Browse Properties' },
];

export default function PropertiesClientView(){
  const [tab, setTab] = useState("my");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialTab = searchParams.get("tab") ?? "my";
    setTab(initialTab);
  }, []);

  const handleTabChange = (value: string) => {
    setTab(value);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", value);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  return(
    <div>
      <SegmentedTabs
        tabs={TABS}
        active={tab}
        onChange={handleTabChange}
      />

      <div className="mt-5">
        {tab === 'my' ? 
          (<MyPropertyClientView/>) : tab === 'saved' ? 
          (<SavedPropertyClientView setTab={setTab} />) :
          (<BrowsePropertyClientView/>) 
        }
      </div>

    </div>
  )
}