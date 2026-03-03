import { DescriptionList } from "@/components/common/DescriptionList"
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents"
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase"
import { ClockIcon } from "@heroicons/react/24/solid";
import { files } from "../mortgage-activation/UserMortgageDocument";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function UserAgreementDocumentList({documents}:{
  documents: TransactionDocumentBase[]
}){
  
  const latestDoc = documents[0] 
  const status = latestDoc?.status

  const statusBanner = () => {
    if (status === 'sent') {
      return {
        bg: 'bg-yellow-50 border-yellow-200',
        icon: <ClockIcon className='h-6 w-6 text-yellow-600' />,
        title: 'Awaiting Signatures',
        message: `Neither party has signed the ${humanizeSnakeCase(latestDoc.document_type)} yet. Signing emails have been sent to both buyer and seller.`,
      }
    }

    if (status === 'partially_signed') {
      const signatures = latestDoc.signatures as Record<string, any> || {}
      const signedParty = Object.keys(signatures)[0] 
      const waitingParty = signedParty === 'buyer' ? 'seller' : 'buyer'
      const signedName = signatures[signedParty]?.name

      return {
        bg: 'bg-blue-50 border-blue-200',
        icon: <ClockIcon className='h-6 w-6 text-blue-600' />,
        title: 'Partially Signed',
        message: `${signedName} (${humanizeSnakeCase(signedParty)}) has signed. Waiting for the ${waitingParty} to complete their signature.`,
      }
    }

    if ( status === 'completed') {
      return {
        bg: 'bg-green-50 border-green-200',
        icon: <CheckCircleIcon className='h-6 w-6 text-green-600' />,
        title: 'Fully Signed',
        message: `All parties have signed the ${humanizeSnakeCase(latestDoc.document_type)}. The completed document is available below.`,
      }
    }

    return null
  }

  const banner = latestDoc ? statusBanner() : null

  return(
    <div>

      {banner && (
        <div className={`${banner.bg} border rounded-lg p-4 mb-6`}>
          <div className="flex items-start gap-3">
            {banner.icon}
            <div className="flex-1">
              <h3 className={`font-semibold ${
                status === 'sent' ? 'text-yellow-800' :
                status === 'partially_signed' ? 'text-blue-800' :
                'text-green-800'
              }`}>
                {banner.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {banner.message}
              </p>
            </div>
          </div>
        </div>
      )}

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