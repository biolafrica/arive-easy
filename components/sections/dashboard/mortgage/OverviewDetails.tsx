import { StatsCard } from "@/components/cards/dashboard/StatsCard";
import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { statData } from "@/data/pages/dashboard/mortgage";
import { formatDate } from "@/lib/formatter";
import { Mortgage } from "@/type/pages/dashboard/mortgage";
import * as utils from "./MortgageUtils";
import MortgagePaymentSummaryTable from "./MortagePaymentSummaryTable";
import { PropertyBase } from "@/type/pages/property";


export default function OverviewDetails({mortgage, setActiveTab, property}: {
  mortgage: Mortgage,
  setActiveTab: (value:string) => void
  property: PropertyBase
}) {
  return(

    <div className="space-y-6">

      <StatsGrid>
        {statData(
          (mortgage?.approved_loan_amount || 0) - ((mortgage?.payments_made || 0) * (mortgage?.monthly_payment || 0)),
          mortgage?.next_payment_date ? formatDate(mortgage?.next_payment_date) : 'N/A',
          mortgage?.last_payment_date,
        ).map((stat) => {
          const Icon = stat.icon;
          return (
            <StatsCard
              key={stat.id}
              icon={<Icon className="h-6 w-6" />}
              title={stat.title}
              value={stat.value}
            />
          );
        })}

      </StatsGrid>

      <utils.ProgressSection mortgage={mortgage} />


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <utils.LoanDetailsSection mortgage={mortgage} />
        </div>
        <div>
          <utils.PropertyInfoSection property={property} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <MortgagePaymentSummaryTable id={mortgage.id}  setActiveTab={()=>setActiveTab('payments')} />
      </div>
    </div>
  )
}