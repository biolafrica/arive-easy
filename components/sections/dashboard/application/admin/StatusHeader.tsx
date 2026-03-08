import { StatusBanner } from "@/components/common/Statusbanner";

export const StatusHeader = ({ status }: { status: string }) => {
  return (
    <div className="mb-6">

      {status === 'pending' && (
        <StatusBanner 
          variant="pending"  
          title="Awaiting Approval"   
          message="Review the application details below and take appropriate action." 
        />
      )}

      {status === 'approved' && (
        <StatusBanner 
          variant="success"  
          title="Successfully Approved"     
          message="This application has been approved and the applicant has been notified." 
        />
      )}

      {status === 'draft' && (
        <StatusBanner 
          variant='review'
          title="Draft Application"     
          message="The user is still working on their application. You can review the details, but no action is needed at this time." 
        />
      )}

      {status === 'rejected' && (
        <StatusBanner 
          variant="error"    
          title="Application Rejected"      
          message="This application has been rejected and the applicant has been notified." 
        />
      )}

    </div>
  );
};