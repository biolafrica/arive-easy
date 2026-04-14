import { MortgageInputs, MortgageOutputs } from "@/type/pages/calculator";

export const FIXED_INTEREST_RATE  = 0.0975;      // 9.75% p.a. — fixed
export const FIXED_MANAGEMENT_FEE = 0.01;         // 1% of loan amount p.a.
export const FIXED_ADVISORY_FEE   = 0.01;         // 1% of loan amount p.a.
export const MIN_EQUITY_PERCENT   = 10;           // 10% minimum down payment
export const MIN_HOME_PRICE       = 0;   // $12.5M minimum property value

export function calculateMortgage(inputs: MortgageInputs): MortgageOutputs {
  const {
    homePrice,
    downPayment,
    loanTerm,
    propertyTaxRate = 0.0052,
    homeInsurance   = 0,
    pmiRate         = 0.005,
  } = inputs;

  // Interest rate is fixed globally — any value passed in is ignored
  const interestRate     = FIXED_INTEREST_RATE;
  const loanAmount       = homePrice - downPayment;
  const monthlyRate      = interestRate / 12;
  const numberOfPayments = loanTerm * 12;

  // Standard amortisation formula
  const monthlyPrincipalInterest =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  const monthlyPropertyTax = 0;
  const downPaymentPercent = (downPayment / homePrice) * 100;
  const monthlyPMI         = 0;

  // New fees — annual rate on loan amount, divided to monthly
  const monthlyManagementFee = 0;
  const monthlyAdvisoryFee   = 0;

  const totalMonthlyPayment =
    monthlyPrincipalInterest +
    monthlyPropertyTax +
    homeInsurance +
    monthlyPMI +
    monthlyManagementFee +
    monthlyAdvisoryFee;

  const totalInterestPaid = monthlyPrincipalInterest * numberOfPayments - loanAmount;
  const totalCostOfLoan   = loanAmount + totalInterestPaid;

  return {
    loanAmount,
    monthlyPrincipalInterest,
    monthlyPropertyTax,
    monthlyHomeInsurance: homeInsurance,
    monthlyPMI,
    monthlyManagementFee,   // ← new
    monthlyAdvisoryFee,     // ← new
    totalMonthlyPayment,
    totalInterestPaid,
    totalCostOfLoan,
  };
}
