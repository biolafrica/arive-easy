"use client"

import { usePreApprovals } from "@/hooks/useSpecialized/usePreApproval";
import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";

export default function Test(){
 const reference = generateApplicationRefNo();
 const {preApprovals} = usePreApprovals();

  console.log("year", reference)
  console.log('pre-approvals', preApprovals)
 
  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}