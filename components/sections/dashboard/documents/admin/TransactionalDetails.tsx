import { DescriptionList } from "@/components/common/DescriptionList"
import { Badge } from "@/components/primitives/Badge";
import { formatDate } from "@/lib/formatter";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents"
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";

const fallback = '--:--';

export default function TransactionalDocumentDetails({document}:{
  document:TransactionDocumentBase
}){
  const signatories = document.signatures;
  return(
    <div className="space-y-10">

      {document.generated_document_url && (
        <DescriptionList
          title={`${document.transaction_document_number} image`}
          subtitle={`${humanizeSnakeCase(document.document_type)} attachment`}
          items={[
            {
              label: 'Attachments',
              value: {
                type: 'attachments',
                files : [
                  {name: document.document_type, url: document.generated_document_url}
                ]
              },
            },
          ]}
        />
      )}

      <DescriptionList
        title={`${document.transaction_document_number} Transactional Document`}
        subtitle="Transactional Document Details"
        items={[
          { label: 'Document Type', value: { type: 'text', value: humanizeSnakeCase(document.document_type) ?? fallback } },
          { label: 'Transactional Document Number', value: { type: 'text', value: document.transaction_document_number ?? fallback } },
          { label: 'Status', value: { type: 'text', value: document.status|| fallback } },
          { label: 'E sign Provider', value: { type: 'text', value: document.esign_provider || fallback } },
          { label: 'Sent Date', value: { type: 'text', value: formatDate(document.sent_at ?? '') ?? fallback } },
          { label: 'Completed Date', value: { type: 'text', value: formatDate(document.completed_at ?? '') ?? 'Not Completed' } },

          { label: 'Seller ID', value: { type: 'text', value: document.seller_id || fallback } },
          { label: 'Property ID', value: { type: 'text', value: document.property_id|| fallback } },
          { label: 'Template ID', value: { type: 'text', value: document.template_id || fallback } },
          { label: 'Buyer ID', value: { type: 'text', value: document.buyer_id || fallback } },
          { label: 'Application ID', value: { type: 'text', value: document.application_id || fallback } },
          { label: 'Partner Document ID', value: { type: 'text', value: document.partner_document_id || fallback } },
        ]}
      />

      {document.esign_provider === 'anvil' && (
        <DescriptionList
          title="Signatories"
          subtitle="Transaction Signing Parties"
          items={[
            { label: 'Buyer Name', value: { type: 'text', value: signatories.buyer.name } },
            { label: 'Buyer Email', value: { type: 'text', value: signatories.buyer.email } },
            {
              label: 'Buyer Status',
              value: {
                type: 'custom',
                node: <Badge variant={signatories.buyer.status === 'completed' ? 'success' : 'info'}>
                  {humanizeSnakeCase(signatories.buyer.status)}
                </Badge>
              }
            },
            {
              label: 'Buyer Signed At',
              value: {
                type: 'text',
                value: signatories.buyer.completedAt ? formatDate(signatories.buyer.completedAt): fallback
              }
            },

            { label: 'Seller Name', value: { type: 'text', value: signatories.seller.name } },
            { label: 'Seller Email', value: { type: 'text', value: signatories.seller.email } },
            {
              label: 'Seller Status',
              value: {
                type: 'custom',
                node: <Badge variant={signatories.seller.status === 'completed' ? 'success' : 'info'}>
                  {humanizeSnakeCase(signatories.seller.status)}
                </Badge>
              }
            },
            {
              label: 'Seller Signed At',
              value: {
                type: 'text',
                value: signatories.seller.completedAt ? formatDate(signatories.seller.completedAt) : fallback
              }
            },
          ]}
        />
        
      )}

    </div>
  )
}