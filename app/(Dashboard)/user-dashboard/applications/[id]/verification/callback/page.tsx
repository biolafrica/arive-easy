import VerificationCallbackClientView from '@/components/sections/dashboard/application/stages/verification/VerificationCallbackClientView';

export default async function VerificationCallbackPage({params}: {
  params: { id: string };
}) {
  const {id:applicationId} =  await params;
  return(<VerificationCallbackClientView  applicationId={applicationId}/>)
}