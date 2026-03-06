import { createMetadata } from "@/components/common/metaData";
import PaymentCancelledPage from "@/components/sections/dashboard/application/stages/verification/Cancelled";

export const metadata = createMetadata({ noIndex: true });

export default function CancelledPage(){
  return(
    <div>
      <PaymentCancelledPage/>
    </div>
  )
}