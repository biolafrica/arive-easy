import { StatusBanner } from "@/components/common/Statusbanner"

export default function PropertyStageStatusBanner({ propertyName, reason, status }: {
  propertyName: string, 
  reason?: string , 
  status: string
}) {
  return(
    <>
     {status === 'sent' && (
        <StatusBanner 
          variant="info"     
          title="Awaiting Seller Review"    
          message={`Your selection for ${propertyName} has been sent…`} 
        />
      )}

      {status === 'approved' && (
        <StatusBanner 
          variant="success"  
          title="Property Approved!"        
          message={`Great news! The seller has approved…`} 
        />

      )}

      {status === 'declined' && (
        <StatusBanner 
          variant="error"    
          title="Property Selection Declined" 
          message={`Unfortunately, your selection for ${propertyName} was declined.`}>
          {reason && 
            <div className="mt-2 rounded bg-red-100 p-2 text-sm text-red-800">
              <strong>Reason:</strong> {reason}
            </div>
          }
          <p className="mt-2 text-sm text-red-700">Please select another property below.</p>
        </StatusBanner>
      )}
    </>
  )
}

