import { DescriptionList } from "@/components/common/DescriptionList";

export default function PropertyDocumentsList(){
  return(
    <div className="pt-6">
      <DescriptionList
        title="Documents Information"
        subtitle="Documents applied to this property"
        items={[
          {label: 'Attachments',
            value: {
              type: 'attachments',
              files: [
                {name: 'Seller Agreement', url:'https://rhxbrjeeblfkokellqbb.supabase.co/storage/v1/object/public/media/pre-approval-documents/1767724772875_b3aw8.jpeg'},
                {name: 'Contract of Sales', url:'https://rhxbrjeeblfkokellqbb.supabase.co/storage/v1/object/public/media/pre-approval-documents/1767724772875_b3aw8.jpeg'},
                {name: 'Dead of Assignment', url:'https://rhxbrjeeblfkokellqbb.supabase.co/storage/v1/object/public/media/pre-approval-documents/1767724772875_b3aw8.jpeg'},
                {name: 'Land Purchase Receipt', url:'https://rhxbrjeeblfkokellqbb.supabase.co/storage/v1/object/public/media/pre-approval-documents/1767724772875_b3aw8.jpeg'}
              ].filter(Boolean) as any,
            },
          },
        ]}
      />
    </div>
  )
}