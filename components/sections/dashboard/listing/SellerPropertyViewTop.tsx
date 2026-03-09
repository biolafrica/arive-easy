import { InformationCircleIcon } from "@heroicons/react/24/outline";
import ApplicationStages from "./ApplicationStages";
import PropertyDocuments from "./PropertyDocuments";

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

function NotAvailableMessage() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
      <InformationCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
      <p className="text-sm text-yellow-800">
        This property is still <span className="font-semibold">available for purchase</span> and has not been reserved yet. 
        Application and document details will appear here once a buyer reserves the property.
      </p>
    </div>
  );
}

export default function SellerPropertyViewTop({status, id}:{status:string, id:string}){
  const isActive = status === "reserved" || status === "sold";

  if (!isActive) {
    return <NotAvailableMessage />;
  }

  return(
    <div className="lg:grid grid-cols-5 gap-5">
      <ApplicationStages id={id}/>
      <PropertyDocuments id={id}/>
    </div>
  )

}