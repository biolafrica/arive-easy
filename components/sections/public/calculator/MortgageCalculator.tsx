'use client';

import { useState,useMemo } from 'react';
import { Button } from '@/components/primitives/Button';
import { Card, Row } from './Card';
import { Field } from './Field';
import { MortgageInputs, MortgageOutputs } from '@/type/pages/calculator';
import { formatCurrency, parseCurrencyInput } from '@/lib/formatter';
import { calculateMortgage } from '@/utils/mortgageCalculation';



const INTEREST_RATES = {
  30: 0.065,
  25: 0.063,
  20: 0.061, 
  15: 0.058, 
};

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<string>('580000');
  const [downPayment, setDownPayment] = useState<string>('60000');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('10.3');
  const [loanTerm, setLoanTerm] = useState<number>(30);
  
  const [propertyTaxRate] = useState<number>(0.0052);
  const [homeInsurance] = useState<number>(100);
  const [pmiRate] = useState<number>(0.005);


  const calculations = useMemo<MortgageOutputs>(() => {
    const inputs: MortgageInputs = {
      homePrice: parseCurrencyInput(homePrice),
      downPayment: parseCurrencyInput(downPayment),
      downPaymentPercent: parseFloat(downPaymentPercent),
      loanTerm,
      interestRate: INTEREST_RATES[loanTerm as keyof typeof INTEREST_RATES] || 0.065,
      propertyTaxRate,
      homeInsurance,
      pmiRate,
    };

    return calculateMortgage(inputs);
  }, [homePrice, downPayment, downPaymentPercent, loanTerm, propertyTaxRate, homeInsurance, pmiRate]);

  const handleHomePriceChange = (value: string) => {
    setHomePrice(value);
    const price = parseCurrencyInput(value);
    const dpAmount = (price * parseFloat(downPaymentPercent)) / 100;
    setDownPayment(dpAmount.toString());
  };

  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value);
    const dp = parseCurrencyInput(value);
    const price = parseCurrencyInput(homePrice);
    if (price > 0) {
      const percent = (dp / price) * 100;
      setDownPaymentPercent(percent.toFixed(1));
    }
  };

  const handleDownPaymentPercentChange = (value: string) => {
    setDownPaymentPercent(value);
    const price = parseCurrencyInput(homePrice);
    const percent = parseFloat(value) || 0;
    const dpAmount = (price * percent) / 100;
    setDownPayment(dpAmount.toString());
  };

  const formatInputValue = (value: string): string => {
    const num = parseCurrencyInput(value);
    return num > 0 ? formatCurrency(num) : '';
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold text-heading">
              Loan Configuration
            </h3>

            <div className="space-y-5">
              <Field label="Home Price">
                <div className="relative">
                  <input 
                    type="text"
                    className="input pl-8"
                    value={formatInputValue(homePrice)}
                    onChange={(e) => handleHomePriceChange(e.target.value)}
                    placeholder="$0"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                </div>
              </Field>

              <Field label={`Down Payment (${downPaymentPercent}%)`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input 
                      type="text"
                      className="input pl-8"
                      value={formatInputValue(downPayment)}
                      onChange={(e) => handleDownPaymentChange(e.target.value)}
                      placeholder="$0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number"
                      className="input pr-8"
                      value={downPaymentPercent}
                      onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
                {parseFloat(downPaymentPercent) < 20 && (
                  <p className="mt-2 text-sm text-orange-600">
                    Note: PMI required for down payments less than 20%
                  </p>
                )}
              </Field>

              <Field label="Loan Term">
                <select 
                  className="input"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                >
                  <option value={30}>30 years</option>
                  <option value={25}>25 years</option>
                  <option value={20}>20 years</option>
                  <option value={15}>15 years</option>
                </select>
                <p className="mt-2 text-sm text-secondary">
                  Interest Rate: {(INTEREST_RATES[loanTerm as keyof typeof INTEREST_RATES] * 100).toFixed(1)}% APR
                </p>
              </Field>
            </div>


          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-orange-600 p-6 text-white">
            <p className="text-sm opacity-90">Total Monthly Payment</p>
            <h2 className="mt-2 text-3xl font-semibold">
              {formatCurrency(calculations.totalMonthlyPayment)}
            </h2>
            <p className="mt-2 text-xs opacity-75">
              Based on {(INTEREST_RATES[loanTerm as keyof typeof INTEREST_RATES] * 100).toFixed(1)}% interest rate
            </p>
          </div>

          <Card title="Payment Breakdown (Monthly)">
            <Row 
              label="Principal & Interest" 
              value={formatCurrency(calculations.monthlyPrincipalInterest)} 
            />
            <Row 
              label="Property Tax" 
              value={formatCurrency(calculations.monthlyPropertyTax)} 
            />
            <Row 
              label="Home Insurance" 
              value={formatCurrency(calculations.monthlyHomeInsurance)} 
            />
            {calculations.monthlyPMI > 0 && (
              <Row 
                label="PMI" 
                value={formatCurrency(calculations.monthlyPMI)} 
              />
            )}
          </Card>

          <Card title="Loan Summary">
            <Row 
              label="Loan Amount" 
              value={formatCurrency(calculations.loanAmount)} 
            />
            <Row 
              label="Down Payment" 
              value={`${formatCurrency(parseCurrencyInput(downPayment))} (${downPaymentPercent}%)`} 
            />
            <Row 
              label="Total Interest Paid" 
              value={formatCurrency(calculations.totalInterestPaid)} 
            />
            <Row 
              label="Total Cost of Loan" 
              value={formatCurrency(calculations.totalCostOfLoan)} 
            />
          </Card>

          <div className="rounded-xl bg-orange-100 p-6 text-center">
            <h4 className="font-semibold text-heading">
              Ready to Get Pre-approved?
            </h4>
            <p className="mt-2 text-sm text-secondary">
              Start your mortgage application process and get pre-approved
              in as little as 48 hours.
            </p>
            <Button className="mt-4">
              Get Pre-approved Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}