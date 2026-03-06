import { createMetadata } from "@/components/common/metaData";
import PaymentSuccessPage from "@/components/sections/dashboard/application/stages/verification/Success";

export const metadata = createMetadata({ noIndex: true });

export default function SuccessPage(){
  return(
    <div>
      <PaymentSuccessPage/>
    </div>
  )
}