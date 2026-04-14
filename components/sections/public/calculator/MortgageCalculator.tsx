'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/primitives/Button';
import { Card, Row } from './Card';
import { Field } from './Field';
import { MortgageInputs, MortgageOutputs } from '@/type/pages/calculator';
import { formatCurrency, formatUSD, parseCurrencyInput } from '@/lib/formatter';
import {
  calculateMortgage,
  FIXED_INTEREST_RATE,
  FIXED_MANAGEMENT_FEE,
  FIXED_ADVISORY_FEE,
  MIN_EQUITY_PERCENT,
  MIN_HOME_PRICE,
} from '@/utils/public/mortgageCalculation';

export default function MortgageCalculator() {
  // Defaults: minimum property value + minimum 10% equity
  const [homePrice, setHomePrice] = useState<string>(MIN_HOME_PRICE.toString());
  const [downPayment, setDownPayment] = useState<string>(
    ((MIN_HOME_PRICE * MIN_EQUITY_PERCENT) / 100).toString()
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>(
    MIN_EQUITY_PERCENT.toString()
  );
  const [loanTerm, setLoanTerm] = useState<number>(5);

  const [propertyTaxRate] = useState<number>(0.0052);
  const [homeInsurance]   = useState<number>(100);
  const [pmiRate]         = useState<number>(0.005);

  // Derived parsed values used for validation + calculations
  const parsedPrice   = parseCurrencyInput(homePrice);
  const parsedDP      = parseCurrencyInput(downPayment);
  const parsedPercent = parseFloat(downPaymentPercent) || 0;

  const isPriceTooLow  = parsedPrice > 0 && parsedPrice < MIN_HOME_PRICE;
  const isEquityTooLow = parsedPercent > 0 && parsedPercent < MIN_EQUITY_PERCENT;

  const calculations = useMemo<MortgageOutputs>(() => {
    const inputs: MortgageInputs = {
      homePrice: parsedPrice,
      downPayment: parsedDP,
      downPaymentPercent: parsedPercent,
      loanTerm,
      interestRate: FIXED_INTEREST_RATE, // ignored inside calculateMortgage
      propertyTaxRate,
      homeInsurance,
      pmiRate,
    };
    return calculateMortgage(inputs);
  }, [parsedPrice, parsedDP, parsedPercent, loanTerm, propertyTaxRate, homeInsurance, pmiRate]);


  const handleHomePriceChange = (value: string) => {
    setHomePrice(value);
    const price = parseCurrencyInput(value);
    setDownPayment(((price * parseFloat(downPaymentPercent)) / 100).toString());
  };

  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value);
    const dp    = parseCurrencyInput(value);
    const price = parseCurrencyInput(homePrice);
    if (price > 0) setDownPaymentPercent(((dp / price) * 100).toFixed(1));
  };

  const handleDownPaymentPercentChange = (value: string) => {
    setDownPaymentPercent(value);
    const price   = parseCurrencyInput(homePrice);
    const percent = parseFloat(value) || 0;
    setDownPayment(((price * percent) / 100).toString());
  };

  const fmt = (value: string) => {
    const num = parseCurrencyInput(value);
    return num > 0 ? formatCurrency(num) : '';
  };


  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* LEFT — inputs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="mb-1 text-lg font-semibold text-heading">Loan Configuration</h3>

            <div className="space-y-5">
              {/* Home Price */}
              <Field label="Home Price">
                <div className="relative">
                  <input
                    type="text"
                    className="input pl-8"
                    value={fmt(homePrice)}
                    onChange={(e) => handleHomePriceChange(e.target.value)}
                    placeholder="$0"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                </div>
                {isPriceTooLow && (
                  <p className="mt-2 text-sm text-red-600">
                    Minimum property value is {formatUSD({amount:MIN_HOME_PRICE, decimals:2})}.
                  </p>
                )}
              </Field>

              {/* Down Payment */}
              <Field label={`Down Payment (${downPaymentPercent}%) — minimum ${MIN_EQUITY_PERCENT}% equity required`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      className="input pl-8"
                      value={fmt(downPayment)}
                      onChange={(e) => handleDownPaymentChange(e.target.value)}
                      placeholder="$0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      className="input pr-8"
                      value={downPaymentPercent}
                      onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                      min={MIN_EQUITY_PERCENT}
                      max="100"
                      step="0.1"
                      placeholder={MIN_EQUITY_PERCENT.toString()}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
                {isEquityTooLow && (
                  <p className="mt-2 text-sm text-red-600">
                    A minimum of {MIN_EQUITY_PERCENT}% equity is required.
                  </p>
                )}
                {!isEquityTooLow && parsedPercent < 20 && (
                  <p className="mt-2 text-sm text-orange-600">
                  </p>
                )}
              </Field>

              {/* Loan Term */}
              <Field label="Loan Term">
                <select
                  className="input"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                >
                  {[3, 5, 10, 15, 20].map((t) => (
                    <option key={t} value={t}>{t} years</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* RIGHT — outputs */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero total */}
          <div className="rounded-xl bg-orange-600 p-6 text-white">
            <p className="text-sm opacity-90">Total Monthly Payment</p>
            <h2 className="mt-2 text-3xl font-semibold">
              {formatUSD({amount:calculations.monthlyPrincipalInterest , decimals:2})}
            </h2>
            <p className="mt-2 text-xs opacity-75">
              {(FIXED_INTEREST_RATE * 100).toFixed(2)}% fixed APR · {loanTerm}-year term
            </p>
          </div>

          {/* Payment breakdown */}
          <Card title="Payment Breakdown (Monthly)">
            <Row label="Principal & Interest"   value={formatUSD({amount:calculations.monthlyPrincipalInterest, decimals:2})} />
            <Row label="Property Tax"   value={formatUSD({amount:0, decimals:2})} />
            <Row label="Home Insurance" value={formatUSD({amount:0, decimals:2})} />
            
          </Card>

          {/* Loan summary */}
          <Card title="Loan Summary">
            <Row label="Loan Amount"  value={formatUSD({amount:calculations.loanAmount, decimals:2})} />
            <Row
              label="Down Payment"
              value={`${formatCurrency(parsedDP)} (${downPaymentPercent}%)`}
            />
            <Row label="Total Interest Paid" value={formatUSD({amount:calculations.totalInterestPaid, decimals:2})} />
            <Row label="Total Cost of Loan"  value={formatUSD({amount:calculations.totalCostOfLoan, decimals:2})} />
          </Card>

          {/* CTA */}
          <div className="rounded-xl bg-orange-100 p-6 text-center">
            <h4 className="font-semibold text-heading">Ready to Get Pre-approved?</h4>
            <p className="mt-2 text-sm text-secondary">
              Start your mortgage application process and get pre-approved in as little as 48 hours.
            </p>
            <Button className="mt-4">Get Pre-approved Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
}