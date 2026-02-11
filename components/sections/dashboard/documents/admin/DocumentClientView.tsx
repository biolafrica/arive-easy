'use client';

import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { useState } from "react";
import SellerDocumentClientView from "./SellerDocumentClientView";
import TemplateClientView from "./TemplateClientView";
import BankDocumentClientView from "./BankDocumentClientView";

export const TABS = [
  { id: 'seller', label: 'Seller' },
  { id: 'templates', label: 'Template' },
  { id: 'banks', label: 'Banks' },
];

export default function DocumentClientView() {
  const [tab, setTab] = useState('seller');

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <SegmentedTabs
          tabs={TABS}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'seller' && (<SellerDocumentClientView />)}
      {tab === 'templates' && (<TemplateClientView />)}
      {tab === 'banks' && (<BankDocumentClientView />)}
      
    </div>
  );
}