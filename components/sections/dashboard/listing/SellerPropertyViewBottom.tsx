import OfferClientView from "../offers/OfferClientView";

export default function SellerPropertyViewBottom({id}:{id:string}){
  return(
    <div>
      <OfferClientView value={id}/>
    </div>
  )

}