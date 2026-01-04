'use client'

import { CompositeDatePicker } from "@/components/ui/DatePicker";
import { useState } from "react";

export default function SellerDashboardApplication (){
    const [birthDate, setBirthDate] = useState<string | undefined>(undefined);
  return(
    <div>
      <h4>Seller Dashboard Application</h4>
      <CompositeDatePicker
        value={birthDate}
        onChange={setBirthDate}
        placeholder="Select your birth date"
        format="DMY"
        yearRange={{ start: 1920, end: 2006 }}
        max={new Date().toISOString().split('T')[0]} 
      />
    </div>
  )
}