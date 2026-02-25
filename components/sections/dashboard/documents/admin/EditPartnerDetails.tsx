import { PartnerDocumentBase } from "@/type/pages/dashboard/documents"
import { getStatusBadge } from "../../transaction/user/UserTransactionDetails"
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase"
import { DescriptionList } from "@/components/common/DescriptionList"

export function formatLabel(key:any) {
  return key
  .replace(/Value$/, '')
  .replace(/([A-Z])/g, ' $1')          
  .replace(/^./, (str:string) => str.toUpperCase()); 
}

export default function EditPartnerDetails({document}:{
  document: PartnerDocumentBase
}) {

  const dynamicItems = Object.entries(document.static_data || {}).map(
    ([key, value]) => ({
      label: formatLabel(key),
      value: {
        type: 'text' as const,
        value: value || '',
      },
    })
  );

  return(
    <div className="space-y-8">

      <div>
        <div className="flex items-center justify-between border border-border p-5 rounded-xl">
          <span className="font-bold text-2xl" >{humanizeSnakeCase(document.document_type)}</span>
          <span className={`${getStatusBadge(document.status)}`}>{document.status}</span>
        </div>
      </div>

      <div>
        <DescriptionList
          title="Document Information"
          subtitle={`Details and information about ${humanizeSnakeCase(document.document_type)} `}
          items={[
            { label: 'Document Number', value: { type: 'text', value: document.partner_document_number || ''}},
            { label: 'Document Name', value: { type: 'text', value: document.document_name || ''}},
            { label: 'Version', value: { type: 'text', value: `${document.template_version}` || ''}},
            { label: 'Template ID', value: { type: 'text', value: document.template_id || ''}},
            { label: 'Partner Type', value: { type: 'text', value: document.partner_type || ''}},
            { label: 'Partner ID', value: { type: 'text', value: document.partner_id || ''}},
          ]}
        />
      </div>

      <div>
        <DescriptionList
          title='Partner Static Data'
          subtitle={`${document.partner_type} data Assigned to ${humanizeSnakeCase(document.document_type)} version ${document.template_version}`}
          items={dynamicItems}
        />
      </div>

      <div>
        <DescriptionList
          title="Template Image"
          subtitle="Template Document Image"
          items={[
            {
              label: 'Attachments',
              value: {
                type: 'attachments',
                files :[
                  {name: 'Template', url:document.template_document_url || ''}
                ]
              },
            },
          ]}
        />
      </div>

    </div>
  )
}