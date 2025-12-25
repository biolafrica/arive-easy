import { MortgageCard } from "@/components/cards/dashboard/MortgageCard";

export default function MyPropertyClientView(){
  return(
    <div className="grid gap-6 lg:grid-cols-2">
      <MortgageCard
        title="Mary Keyes Residence"
        address="123 Mary Keyes Street, Utako, Abuja"
        status="active"
        propertyValue="₦500,000,000"
        loanBalance="₦380,000,000"
        interestRate="6.7%"
        monthlyPayment="₦360,000"
        progressPercent={50}
        paidAmount="₦120,000,000"
        remainingAmount="₦380,000,000"
        nextPaymentDue="February 15, 2025"
        mortgageEndDate="December 2054"
        onMakePayment={() => {}}
      />

      <MortgageCard
        title="Greenwood Estate"
        address="123 Mary Keyes Street, Utako, Abuja"
        status="closed"
        propertyValue="₦500,000,000"
        loanBalance="₦0"
        interestRate="6.7%"
        monthlyPayment="₦360,000"
        progressPercent={100}
        paidAmount="₦500,000,000"
        remainingAmount="₦0"
        mortgageEndDate="December 2025"
      />
    </div>

  )
}