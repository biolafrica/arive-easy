import VerificationCallbackClientView from '@/components/sections/dashboard/application/stages/verification/VerificationCallbackClientView';

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