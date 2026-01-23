import { ApplicationBase } from '@/type/pages/dashboard/application';
import { VerificationFeeInfo } from './InfoBanner';
import VerificationClientView from './VerificationClientView';
import { IdentityVerificationData } from '@/type/common/didit';


interface Props {
  application: ApplicationBase;
  stageData?: IdentityVerificationData;
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

const getHasPaid = (status: string): boolean => {
  return status === 'paid';
};

export default function IdentityVerificationStage({
  application,
  stageData,
  onUpdate,
  isReadOnly,
  isUpdating,
}: Props) {
  const handleStatusUpdate = () => {
    onUpdate({
      identity_verification_status: 'pending',
    });
  };

  const verificationData: IdentityVerificationData | undefined = stageData
    ? {
        home_country_session_id: stageData.home_country_session_id,
        home_country_status: stageData.home_country_status || 'not_started',
        home_country_verified_at: stageData.home_country_verified_at,
        home_country_document_type: stageData.home_country_document_type,
        home_country_document_number: stageData.home_country_document_number,
        home_country_expiry_date: stageData.home_country_expiry_date,

        immigration_session_id: stageData.immigration_session_id,
        immigration_status: stageData.immigration_status || 'not_started',
        immigration_verified_at: stageData.immigration_verified_at,
        immigration_document_type: stageData.immigration_document_type,
        immigration_document_number: stageData.immigration_document_number,
        immigration_country: stageData.immigration_country,
        immigration_expiry_date: stageData.immigration_expiry_date,

        overall_status: stageData.overall_status || 'not_started',
        updated_at: stageData.updated_at || new Date().toISOString(),
      }
    : undefined;

  return (
    <div className="space-y-8">
      <VerificationFeeInfo />

      <VerificationClientView
        hasPaid={getHasPaid(application.processing_fee_payment_status)}
        application_id={application.id}
        verificationData={verificationData}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}