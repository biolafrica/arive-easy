import { ActionModal, ActionModalConfig, ActionModalData } from "@/components/common/ActionModal";
import { Button } from "@/components/primitives/Button";
import { useSellerOfferActions } from "@/hooks/useSpecialized/useOffers";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { useState } from "react";



interface OfferActionsProps {
  offer: OfferBase; 
  close: ()=>void
}

const OFFER_CONFIG: ActionModalConfig = {
  approve: {
    title: 'Accept Offer',
    buttonText: 'Accept',
    variant: 'filled',
    inputType: 'none',
    inputDescription:"Are you sure you want to Approve",
    required: false,
  },
  decline: {
    title: 'Decline Offer',
    buttonText: 'Decline',
    variant: 'danger',
    inputType: 'string',
    inputLabel: 'Rejection Note (Required)',
    inputPlaceholder: 'Please provide a reason for declining this offer...',
    inputDescription: 'Please explain why you are declining this offer.',
    required: true,
  },
};

export const OfferActions = ({ offer, close }: OfferActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const { acceptOffer, rejectOffer, isUpdating } = useSellerOfferActions();

  const isPending = offer.status === "pending";
  const isProcessed = offer.status === "accepted" || offer.status === "declined";

  const handleModalSubmit = async (data: ActionModalData) => {
    if (data.action === 'approve') {
      await acceptOffer(offer.id, data.notes);
    } else if (data.action === 'decline') {
      await rejectOffer(offer.id, data.notes);
    }
    setTimeout(()=>{
      close()
    }, 1500)
  };

  return (
    <>
      <div className="flex items-center gap-5 p-5">
        <Button
          variant={isPending ? "filled" : "outline"}
          className={`flex-1 ${isProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setShowModal(true)}
          disabled={!isPending || isUpdating}
        >
          {isProcessed ? 'Offer Actions' : 'Review Offer'}
        </Button>
      </div>

      {isProcessed && (
        <div className="text-center text-sm text-gray-500 -mt-3 mb-3">
          This offer has already been {offer.status}
        </div>
      )}

      <ActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        config={OFFER_CONFIG}
        isUpdating={isUpdating}
      />
    </>
  );
};