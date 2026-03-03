import { DescriptionList } from "@/components/common/DescriptionList"
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents"
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase"
import { ClockIcon } from "@heroicons/react/24/solid";
import { files } from "../mortgage-activation/UserMortgageDocument";

export default function UserAgreementDocumentList({documents}:{
  documents: TransactionDocumentBase[]
}){
  
  const pendingDocument = documents.filter((document) => document.status === 'sent')
  const hasPending = pendingDocument.length > 0

  return(
    <div>

      {hasPending && (
        <div className="bg-yellow-50 border-yellow-200 border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <ClockIcon className='h-6 w-6 text-yellow-600' />
            <div className="flex-1">
              <h3 className='font-semibold text-yellow-800'>
                Awaiting Signature
              </h3>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              Awaiting Your to sign {humanizeSnakeCase(pendingDocument[0].document_type)} document
            </p>
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