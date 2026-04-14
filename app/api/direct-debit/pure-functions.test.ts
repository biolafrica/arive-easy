import { describe, it, expect } from 'vitest';
import { calculateNumberOfPayments } from '@/app/api/direct-debit/initiate/route';
import { calculateBillingCycleAnchor } from './utils';




describe('calculateNumberOfPayments', () => {
  it('calculates 12 payments from Jan to Dec of the same year', () => {
    expect(
      calculateNumberOfPayments('2025-01-01', '2025-12-01', null)
    ).toBe(12);
  });

  it('returns 1 when first and last payment are the same month (inclusive boundary)', () => {
    expect(
      calculateNumberOfPayments('2025-06-01', '2025-06-01', null)
    ).toBe(1);
  });

  it('calculates correctly across a year boundary (Dec → Jan)', () => {
    // Dec 2025 → Jan 2026 = 2 payments
    expect(
      calculateNumberOfPayments('2025-12-01', '2026-01-01', null)
    ).toBe(2);
  });

  it('calculates correctly across multiple years (Jan 2025 → Jan 2027 = 25 months)', () => {
    expect(
      calculateNumberOfPayments('2025-01-01', '2027-01-01', null)
    ).toBe(25);
  });

  it('uses loanTermMonths when both dates are null', () => {
    expect(
      calculateNumberOfPayments(null, null, 24)
    ).toBe(24);
  });

  it('uses loanTermMonths when both dates are undefined', () => {
    expect(
      calculateNumberOfPayments(undefined, undefined, 36)
    ).toBe(36);
  });

  it('ignores loanTermMonths when valid dates are provided (dates take priority)', () => {
    // Dates say 12, loanTermMonths says 36 — dates win
    expect(
      calculateNumberOfPayments('2025-01-01', '2025-12-01', 36)
    ).toBe(12);
  });

  //Edge cases — date fallback

  it('falls back to loanTermMonths when only firstPaymentDate is provided', () => {
    // lastPaymentDate is null → cannot calculate from dates → use loanTermMonths
    expect(
      calculateNumberOfPayments('2025-01-01', null, 18)
    ).toBe(18);
  });

  it('falls back to loanTermMonths when only lastPaymentDate is provided', () => {
    expect(
      calculateNumberOfPayments(null, '2025-12-01', 18)
    ).toBe(18);
  });

  it('falls back to default 12 when all three params are null', () => {
    expect(
      calculateNumberOfPayments(null, null, null)
    ).toBe(12);
  });

  it('falls back to default 12 when all three params are undefined', () => {
    expect(
      calculateNumberOfPayments(undefined, undefined, undefined)
    ).toBe(12);
  });

  // Edge cases — guard against bad data

  it('returns default 12 when loanTermMonths is 0 (falsy)', () => {
    // 0 is falsy so the condition `loanTermMonths && loanTermMonths > 0` fails
    expect(
      calculateNumberOfPayments(null, null, 0)
    ).toBe(12);
  });

  it('returns default 12 when loanTermMonths is negative', () => {
    expect(
      calculateNumberOfPayments(null, null, -6)
    ).toBe(12);
  });

  it('returns at least 1 when last date is before first date (Math.max guard)', () => {
    // Feb before Jan — months would be negative without the Math.max(1, months) guard
    expect(
      calculateNumberOfPayments('2025-06-01', '2025-01-01', null)
    ).toBe(1);
  });

  it('handles the exact dollar-amount anti-pattern — $5000 is NOT 5000 payments', () => {
    // This is the bug class: someone passes total_payment (dollar amount) as loop count.
    // The function must derive count from dates, not from a dollar figure.
    // If dates are present, the dollar amount in loanTermMonths is irrelevant.
    expect(
      calculateNumberOfPayments('2025-01-01', '2025-12-01', 5000)
    ).toBe(12); // 12 months, not 5000
  });

  it('handles a full 30-year mortgage (360 payments)', () => {
    expect(
      calculateNumberOfPayments('2025-01-01', '2054-12-01', null)
    ).toBe(360);
  });

  it('handles a 5-year mortgage (60 payments)', () => {
    expect(
      calculateNumberOfPayments('2025-03-01', '2030-02-01', null)
    ).toBe(60);
  });
});

describe('calculateBillingCycleAnchor', () => {

  it('returns the Unix timestamp of firstPaymentDate when provided', () => {
    const firstPaymentDate = '2025-08-01';
    const expected = Math.floor(new Date(firstPaymentDate).getTime() / 1000);

    expect(
      calculateBillingCycleAnchor(firstPaymentDate, 1)
    ).toBe(expected);
  });

  it('ignores paymentDayOfMonth when firstPaymentDate is provided', () => {
    // paymentDayOfMonth = 15, but firstPaymentDate overrides it
    const firstPaymentDate = '2025-08-01';
    const expectedFromDate = Math.floor(new Date(firstPaymentDate).getTime() / 1000);
    const result = calculateBillingCycleAnchor(firstPaymentDate, 15);
    expect(result).toBe(expectedFromDate);
  });

  it('falls back to paymentDayOfMonth when firstPaymentDate is null', () => {
    // When date is null, the function builds a target date from paymentDayOfMonth.
    // We can't know the exact timestamp (depends on "now"), but we can verify:
    // - result is a valid Unix timestamp (positive integer)
    // - the resulting date is in the future
    const now = Math.floor(Date.now() / 1000);
    const result = calculateBillingCycleAnchor(null, 15);

    expect(result).toBeTypeOf('number');
    expect(result).toBeGreaterThan(now); // must be in the future
  });

  it('falls back to paymentDayOfMonth when firstPaymentDate is undefined', () => {
    const now = Math.floor(Date.now() / 1000);
    const result = calculateBillingCycleAnchor(undefined as any, 10);

    expect(result).toBeTypeOf('number');
    expect(result).toBeGreaterThan(now);
  });

  //Edge cases — paymentDayOfMonth fallback

  it('bumps to next month when paymentDayOfMonth has already passed this month', () => {
    // Use day 1 — if today is after the 1st, the anchor should be next month's 1st.
    // We can verify this by checking the returned date is strictly in the future.
    const now = Date.now();
    const result = calculateBillingCycleAnchor(null, 1);
    const resultMs = result * 1000;

    expect(resultMs).toBeGreaterThan(now);
  });

  it('returns a timestamp on the correct day of month when using paymentDayOfMonth', () => {
    // The resulting date's day-of-month should equal paymentDayOfMonth
    const paymentDay = 20;
    const result = calculateBillingCycleAnchor(null, paymentDay);
    const resultDate = new Date(result * 1000);

    expect(resultDate.getDate()).toBe(paymentDay);
  });

  it('returns a valid Unix timestamp (integer, positive, reasonable range)', () => {
    const result = calculateBillingCycleAnchor('2025-09-01', 1);

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThan(0);
    // Sanity: between year 2020 and 2100
    expect(result).toBeGreaterThan(1577836800); // 2020-01-01
    expect(result).toBeLessThan(4102444800);    // 2100-01-01
  });

  it('handles end-of-month dates correctly (e.g. 2025-12-31)', () => {
    const firstPaymentDate = '2025-12-31';
    const expected = Math.floor(new Date(firstPaymentDate).getTime() / 1000);

    expect(
      calculateBillingCycleAnchor(firstPaymentDate, 31)
    ).toBe(expected);
  });

  it('handles a far-future first payment date', () => {
    const firstPaymentDate = '2030-06-01';
    const expected = Math.floor(new Date(firstPaymentDate).getTime() / 1000);

    expect(
      calculateBillingCycleAnchor(firstPaymentDate, 1)
    ).toBe(expected);
  });
});