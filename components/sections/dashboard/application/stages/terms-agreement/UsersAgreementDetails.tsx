import { DescriptionList } from "@/components/common/DescriptionList"
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents"
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase"
import { files } from "../mortgage-activation/UserMortgageDocument";
import { StatusBanner } from "@/components/common/Statusbanner";

export default function UserAgreementDocumentList({documents}:{
  documents: TransactionDocumentBase[]
}){
  
  const latestDoc = documents[0] 
  const status = latestDoc?.status

  const statusBanner = () => {
    if (status === 'sent') {
      return(
        <StatusBanner
          variant="pending" 
          title="Awaiting Signatures"       
          message={`Neither party has signed the ${humanizeSnakeCase(latestDoc.document_type)} yet. Signing emails have been sent to both buyer and seller.`} 
        />
      )
    }

    if (status === 'partially_signed') {
      const signatures = latestDoc.signatures as Record<string, any> || {}
      const signedParty = Object.keys(signatures)[0] 
      const waitingParty = signedParty === 'buyer' ? 'seller' : 'buyer'
      const signedName = signatures[signedParty]?.name
      return(
        <StatusBanner 
          variant="info"     
          title="Partially Signed"          
          message={`${signedName} (${humanizeSnakeCase(signedParty)}) has signed. Waiting for the ${waitingParty} to complete their signature.`} 
        />
      )
    }

    if ( status === 'completed') {
      return(
        <StatusBanner 
          variant="success"  
          title="Fully Signed"              
          message={`All parties have signed the ${humanizeSnakeCase(latestDoc.document_type)}. The completed document is available below.`} 
        />
      )
    }

    return null
  }

  const banner = latestDoc ? statusBanner() : null

  return(
    <div>

      {banner && (banner)}

      <DescriptionList
        title="Agreement Documents"
        subtitle="List Of Agreement Documents You Signed"
        items={[
          {
            label: 'Attachments',
            value: {
              type: 'attachments',
              files: files(documents)
            },
          },
        ]}
      />

    </div>
  )
}