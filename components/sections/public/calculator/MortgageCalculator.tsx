'use client';

import { Button } from '@/components/primitives/Button';
import { Card, Row } from './Card';
import { Range } from './Range';
import { Field } from './Field';

export default function MortgageCalculator() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* LEFT – INPUTS */}

        <div className="lg:col-span-3 space-y-6">

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold text-heading">
              Loan Configuration
            </h3>

            <div className="space-y-5">
              <Field label="Choose Currency">
                <select className="input">
                  <option>USD</option>
                  <option>NGN</option>
                  <option>GBP</option>
                </select>
              </Field>

              <Field label="Home Price">
                <input className="input" placeholder="$580,000" />
                <Range />
              </Field>

              <Field label="Down Payment (10.3%)">
                <input className="input" placeholder="$60,000" />
                <Range />
              </Field>

              <Field label="Interest Rate">
                <input className="input" placeholder="6.5%" />
                <Range />
              </Field>

              <Field label="Loan Term">
                <select className="input">
                  <option>30 years</option>
                  <option>25 years</option>
                  <option>20 years</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold text-heading">
              Additional Monthly Costs
            </h3>

            <div className="space-y-5">
              <Field label="Property Tax (Annual)">
                <input className="input" placeholder="$5,800" />
              </Field>

              <Field label="Home Insurance (Annual)">
                <input className="input" placeholder="$1,200" />
              </Field>

              <Field label="PMI (Monthly)">
                <input className="input" placeholder="$200" />
              </Field>
            </div>
          </div>
        </div>

        {/* RIGHT – OUTPUTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-orange-600 p-6 text-white">
            <p className="text-sm opacity-90">Total Monthly Payment</p>
            <h2 className="mt-2 text-3xl font-semibold">$3,803</h2>
          </div>

          <Card title="Payment Breakdown">
            <Row label="Principal & Interest" value="$3,253" />
            <Row label="Property Tax" value="$250" />
            <Row label="Home Insurance" value="$100" />
            <Row label="PMI" value="$200" />
          </Card>

          <Card title="Loan Summary">
            <Row label="Loan Amount" value="$520,000" />
            <Row label="Down Payment" value="$60,000 (10.3%)" />
            <Row label="Total Interest Paid" value="$650,947" />
            <Row label="Total Cost of Loan" value="$1,170,947" />
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
