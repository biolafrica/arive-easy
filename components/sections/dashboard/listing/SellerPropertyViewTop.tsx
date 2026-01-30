import { DescriptionList } from "@/components/common/DescriptionList";

export const getbadge = (step:string): string => {
  const base = 'badge px-3 py-2 rounded-lg'

  switch(step) {
    case 'current':
      return `${base} badge-blue`;
    case 'paid':
      return `${base} badge-green`;
    case 'escrowed':
      return `${base} badge-green`;
    case 'approved':
      return `${base} badge-green`;
    case 'upcoming':
      return `${base} badge-yellow`;
    case 'completed':
      return `${base} badge-green`;
    default:
      return `${base}`;
  }
};

export default function SellerPropertyViewTop(){
  const current = 'current';
  const upcoming = 'upcoming';
  const completed = 'completed';

  return(
    <div className="lg:grid grid-cols-5 gap-5">

      <div className="col-span-2 mb-10">
        <DescriptionList
          title="Application Progress"
          subtitle="Application Progress BreakDown"
          items={[
            { label: 'Offers Stage', value: { type: 'custom', node:( <h4 className={getbadge(completed)}>{completed}</h4> )}},
            { label: 'Down Payment', value: { type: 'custom', node:( <h4 className={getbadge(current)}>{current}</h4> )}},
            { label: 'Document', value: { type: 'custom', node:( <h4 className={getbadge(upcoming)}>{upcoming}</h4> )}},
            { label: 'Final Payment', value: { type: 'custom', node:( <h4 className={getbadge(upcoming)}>{upcoming}</h4> )}},
            { label: 'Final Documents', value: { type: 'custom', node:( <h4 className={getbadge(upcoming)}>{upcoming}</h4> )}},
          ]}
        />
      </div>

      <div className="col-span-3 mb-10">
        <DescriptionList
          title="Documents Information"
          subtitle="This Application Documents Uploaded"
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

    </div>
  )

}