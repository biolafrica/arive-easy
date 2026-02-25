import { TemplateBase} from "@/type/pages/dashboard/documents";
import { getStatusBadge } from "../../transaction/user/UserTransactionDetails";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";
import { DescriptionList } from "@/components/common/DescriptionList";

export default function TemplateDetail({document}:{
  document: TemplateBase
}) {

  const dynamicItems = (document.template_fields || []).map((item)=>({
    label:item.label,
    value:{
      type: 'text' as const,
      value: item.field_key || '',
    }
  }))

  return (
    <div className="space-y-8">

      <div>
        <div className="flex items-center justify-between border border-border p-5 rounded-xl">
          <span className="font-bold text-2xl" >{humanizeSnakeCase(document.type)}</span>
          <span className={`${getStatusBadge(document.status)}`}>{document.status}</span>
        </div>
      </div>

      <div>
        <DescriptionList
          title="Document Information"
          subtitle={`Details and information about ${humanizeSnakeCase(document.type)} `}
          items={[
            { label: 'Document Number', value: { type: 'text', value: document.template_number || ''}},
            { label: 'Document Name', value: { type: 'text', value: document.name || ''}},
            { label: 'Description', value: { type: 'paragraph', value: document.description || ''}},
            { label: 'Version', value: { type: 'text', value: `${document.version}` || ''}},
            { label: 'Category', value: { type: 'text', value: document.category || ''}},
            { label: 'Anvil Template ID', value: { type: 'text', value: document.anvil_template_id || ''}},
          ]}
        />
      </div>

      <div>
        <DescriptionList
          title='Partner Static Data'
          subtitle={`data Assigned to ${humanizeSnakeCase(document.type)} version ${document.version}`}
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
                  {name: 'Template', url:document.template_file_url || ''}
                ]
              },
            },
          ]}
        />
      </div>

    </div>
  );
}