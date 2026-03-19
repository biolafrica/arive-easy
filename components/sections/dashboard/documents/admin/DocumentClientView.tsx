'use client';

import { useState } from "react";
import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import SellerDocumentClientView from "./SellerDocumentClientView";
import TemplateClientView from "./TemplateClientView";
import TransactionalDocumentClientView from "./TransactionDocumentClientView";

export const TABS = [
  { id: 'partners', label: 'Partners' },
  { id: 'templates', label: 'Templates' },
  { id: 'properties', label: 'Properties' },
];

export default function DocumentClientView() {
  const [tab, setTab] = useState('partners');

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <SegmentedTabs
          tabs={TABS}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'partners' && (<SellerDocumentClientView />)}
      {tab === 'templates' && (<TemplateClientView />)}
      {tab === 'properties' && (<TransactionalDocumentClientView/>)}
      
    </div>
  );
}