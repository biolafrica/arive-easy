import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { formatUSD, toNumber } from "@/lib/formatter";
import { OfferBase, } from "@/type/pages/dashboard/offer";
import { OfferActions } from "./OfferAction";


interface Props {
  offer: OfferBase;
  close: any
}

export default function OfferDetails({ offer, close }: Props) {
  return (
    <div>

      <div className="space-y-8">
        <DescriptionList
          title="Property Details"
          subtitle="Details and information about the property"
          items={[
            { label: 'Property Name', value: { type: 'text', value: offer.properties?.title || "" } },
            { label: 'Property Address', value: { type: 'text', value: offer.properties?.address_full || "" } },
            { label: 'Offered Price', value: { type: 'text', value: formatUSD({ amount: toNumber(offer.amount), fromCents: false, decimals: 2 }) } },
          ]}
        />

        <DescriptionList
          title="Buyer Details"
          subtitle="Details and information about the buyer"
          items={[
            { label: 'Name', value: { type: 'text', value: offer.users?.name || ""} },
            { label: 'Email', value: { type: 'text', value: offer.users?.email || "" } },
            { label: 'Phone Number', value: { type: 'text', value: offer.users?.phone_number || ''} },
          ]}
        />
        
        <DescriptionList
          title="Offer Details"
          subtitle="Details and information about the offer"
          items={[
            { label: 'Offered Amount', value: { type: 'text', value: formatUSD({ amount: toNumber(offer.amount), fromCents: false, decimals: 2 }) } },
            { label: 'Financing', value: { type: 'text', value: offer.type } },
            { label: 'Date', value: { type: 'text', value: new Date(offer.created_at).toLocaleDateString()} },
          ]}
        />

      </div>

     <OfferActions offer={offer} close={close}/>

    </div>
  );
}