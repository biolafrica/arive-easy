import { MortgageInputs, MortgageOutputs } from "@/type/pages/calculator";

export function calculateMortgage(inputs: MortgageInputs): MortgageOutputs {
  const {
    homePrice,
    downPayment,
    loanTerm,
    interestRate,
    propertyTaxRate = 0.01,
    homeInsurance = 100,
    pmiRate = 0.005,
  } = inputs;


  const loanAmount = homePrice - downPayment;

  const monthlyRate = interestRate / 12;
  const numberOfPayments = loanTerm * 12;

  let monthlyPrincipalInterest = 0;
  if (monthlyRate > 0) {
    monthlyPrincipalInterest =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  } else {
    monthlyPrincipalInterest = loanAmount / numberOfPayments;
  }


  const monthlyPropertyTax = (homePrice * propertyTaxRate) / 12;

  const downPaymentPercent = (downPayment / homePrice) * 100;
  const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * pmiRate) / 12 : 0;

  const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + homeInsurance + monthlyPMI;

  const totalInterestPaid = monthlyPrincipalInterest * numberOfPayments - loanAmount;

  const totalCostOfLoan = loanAmount + totalInterestPaid;

  return {
    loanAmount,
    monthlyPrincipalInterest,
    monthlyPropertyTax,
    monthlyHomeInsurance: homeInsurance,
    monthlyPMI,
    totalMonthlyPayment,
    totalInterestPaid,
    totalCostOfLoan,
  };
}
