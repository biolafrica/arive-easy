import { ApplicationBase } from "@/type/pages/dashboard/application";
import { formatDate, formatUSD, toNumber } from "@/lib/formatter";
import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { STAGE_EMPTY_CONFIG } from "@/data/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { getbadge } from "../../../listing/SellerPropertyViewTop";
import { CompleteStageButton } from "../../common/StageActionButton";

interface PaymentStageProps {
  application: ApplicationBase;
  onComplete: () => void;
  onAddPayments: () => void;
}

export function PaymentStage({ application, onComplete, onAddPayments }: PaymentStageProps) {
  const payment = application.stages_completed.payment_setup;
  console.log("PaymentStage Rendered with payment:", payment);

  if (payment?.status === 'upcoming') {
    return <StageDescriptionEmpty {...STAGE_EMPTY_CONFIG[3]} />;
  }

  return (
    <DescriptionList
      title="Payment Setup"
      subtitle="User Payment Setup Stage"
      items={[
        {
          label: 'Payments',
          value: {
            type: 'custom',
            node: 
            <Button 
              onClick={onAddPayments} 
              size='xs' 
            >
              Add Payments
            </Button>
          }
        },
        {
          label: 'Valuation Fee',
          value: {
            type: 'custom',
            node: (
              <div className="flex items-center gap-10">
                <h4 className={getbadge(payment?.data.valuation_fee_status || "upcoming")}>
                  {payment?.data.valuation_fee_status || "upcoming"}
                </h4>
                <h4>{formatUSD({ amount: toNumber(payment?.data.valuation_fee_amount) }) || ''}</h4>
                <h4>{formatDate(payment?.data.valuation_fee_date || '')}</h4>
              </div>
            )
          }
        },
        {
          label: 'Legal Fee',
          value: {
            type: 'custom',
            node: (
              <div className="flex items-center gap-10">
                <h4 className={getbadge(payment?.data.legal_fee_status || "upcoming")}>
                  {payment?.data.legal_fee_status || "upcoming"}
                </h4>
                <h4>{formatUSD({ amount: toNumber(payment?.data.legal_fee_amount) }) || 0}</h4>
                <h4>{formatDate(payment?.data.legal_fee_date || '')}</h4>
              </div>
            )
          }
        },
        {
          label: 'Complete Stage',
          value: {
            type: 'custom',
            node: 
            <CompleteStageButton 
              onComplete={onComplete} 
              stageType='payment' 
              disabled={payment?.completed === true || !payment?.data.valuation_fee_amount || !payment?.data.legal_fee_amount} 
            />
          }
        },
      ]}
    />
  );
}