import { createMetadata } from '@/components/common/metaData';
import VerificationCallbackClientView from '@/components/sections/dashboard/application/stages/verification/VerificationCallbackClientView';

export const metadata = createMetadata({
  title: "User Dashboard - Verification Callback",
  description: "Find your perfect home in Nigeria...",
});

export default async function VerificationCallbackPage(
  { params }: { params: Promise<{ id: string }> } 
) {
  const {id:applicationId} =  await params;
  return(
    <div>
      <VerificationCallbackClientView  applicationId={applicationId}/>
    </div>
  
  )
}