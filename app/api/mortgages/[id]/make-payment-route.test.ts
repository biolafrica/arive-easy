import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const {
  mockRequireAuth,
  mockFindOneByCondition,
  mockUpdate,
  mockUpdateMany,
  mockCreate,
  mockStripePaymentIntentsCreate,
  mockStripePaymentIntentsRetrieve,
  mockStripePaymentMethodsRetrieve,
  mockSupabaseFrom,
  mockSupabaseSingle,
  mockSupabaseEq,
  mockSupabaseSelect,
  mockSupabaseUpdate,
  mockSupabaseOrder,
  mockSupabaseLimit,
  mockSupabaseIn,
} = vi.hoisted(() => {
  const mockSupabaseSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockSupabaseLimit = vi.fn();
  const mockSupabaseOrder = vi.fn();
  const mockSupabaseIn = vi.fn();   // sync by default, use mockResolvedValueOnce for terminal awaits
  const mockSupabaseEq = vi.fn();
  const mockSupabaseSelect = vi.fn();
  const mockSupabaseUpdate = vi.fn();
  const mockSupabaseFrom = vi.fn();

  // Base chainObj — every method returns this so chains never break
  const chainObj = {
    update: mockSupabaseUpdate,
    select: mockSupabaseSelect,
    eq: mockSupabaseEq,
    in: mockSupabaseIn,
    order: mockSupabaseOrder,
    limit: mockSupabaseLimit,
    single: mockSupabaseSingle,
  };

  mockSupabaseFrom.mockReturnValue(chainObj);
  mockSupabaseUpdate.mockReturnValue(chainObj);
  mockSupabaseSelect.mockReturnValue(chainObj);
  mockSupabaseEq.mockReturnValue(chainObj);
  mockSupabaseIn.mockReturnValue(chainObj);     // sync — chain continues after .in()
  mockSupabaseLimit.mockReturnValue(chainObj);  // sync

  const thenableChainDefault = {
    ...chainObj,
    then: (resolve: Function) => resolve({ data: [], error: null }),
    catch: (reject: Function) => thenableChainDefault,
  };
  mockSupabaseOrder.mockReturnValue(thenableChainDefault);

  return {
    mockRequireAuth: vi.fn(),
    mockFindOneByCondition: vi.fn(),
    mockUpdate: vi.fn(),
    mockUpdateMany: vi.fn(),
    mockCreate: vi.fn(),
    mockStripePaymentIntentsCreate: vi.fn(),
    mockStripePaymentIntentsRetrieve: vi.fn(),
    mockStripePaymentMethodsRetrieve: vi.fn(),
    mockSupabaseFrom,
    mockSupabaseSingle,
    mockSupabaseEq,
    mockSupabaseSelect,
    mockSupabaseUpdate,
    mockSupabaseOrder,
    mockSupabaseLimit,
    mockSupabaseIn,
  };
});


vi.mock('@/utils/server/authMiddleware', () => ({
  requireAuth: mockRequireAuth,
}));

vi.mock('@/utils/supabase/queryBuilder', () => {
  const QB = vi.fn().mockImplementation(function () {
    return {
      findOneByCondition: mockFindOneByCondition,
      update: mockUpdate,
      updateMany: mockUpdateMany,
      create: mockCreate,
    };
  });
  QB.prototype = {};
  return { SupabaseQueryBuilder: QB, __esModule: true };
});

vi.mock('@/utils/supabase/supabaseAdmin', () => ({
  supabaseAdmin: { from: mockSupabaseFrom },
}));

vi.mock('stripe', () => {
  const StripeMock = vi.fn().mockImplementation(function () {
    return {
      paymentIntents: {
        create: mockStripePaymentIntentsCreate,
        retrieve: mockStripePaymentIntentsRetrieve,
      },
      paymentMethods: {
        retrieve: mockStripePaymentMethodsRetrieve,
      },
    };
  });
  StripeMock.prototype = {};
  return { default: StripeMock, __esModule: true };
});

import { POST, PUT } from '@/app/api/mortgages/[id]/make-payment/route';


const MOCK_USER = { id: 'user_123', email: 'emeka@example.com' };

const MOCK_MORTGAGE = {
  id: 'mortgage_123',
  user_id: 'user_123',
  application_id: 'app_456',
  stripe_customer_id: 'cus_test',
  stripe_payment_method_id: 'pm_test',
  payment_method_type: 'card',
  status: 'active',
  payments_made: 5,
  total_payments: 24,
  number_of_payments: 24,
};

const MOCK_PAYMENT_INTENT = {
  id: 'pi_test_123',
  client_secret: 'pi_test_123_secret',
  status: 'requires_payment_method',
  last_payment_error: null,
};

const MOCK_PAYMENTS = [
  { id: 'pay_1', payment_number: 1, amount: 1000, due_date: '2024-01-01', status: 'scheduled' },
  { id: 'pay_2', payment_number: 2, amount: 1000, due_date: '2024-02-01', status: 'failed' },
];

function makePostRequest(mortgageId: string, body: object): NextRequest {
  return new NextRequest(
    `http://localhost/api/mortgages/${mortgageId}/make-payment`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

function makePutRequest(mortgageId: string, body: object): NextRequest {
  return new NextRequest(
    `http://localhost/api/mortgages/${mortgageId}/make-payment`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

function makeRouteParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

const chainObj = {
  update: mockSupabaseUpdate,
  select: mockSupabaseSelect,
  eq: mockSupabaseEq,
  in: mockSupabaseIn,
  order: mockSupabaseOrder,
  limit: mockSupabaseLimit,
  single: mockSupabaseSingle,
};

function resetMocks() {
  vi.clearAllMocks();

  // Restore sync chain defaults
  mockSupabaseFrom.mockReturnValue(chainObj);
  mockSupabaseUpdate.mockReturnValue(chainObj);
  mockSupabaseSelect.mockReturnValue(chainObj);
  mockSupabaseEq.mockReturnValue(chainObj);
  mockSupabaseIn.mockReturnValue(chainObj);     // sync — chain continues after .in()
  mockSupabaseLimit.mockReturnValue(chainObj);

  const thenablePayments = {
    ...chainObj,
    then: (resolve: Function) => resolve({ data: MOCK_PAYMENTS, error: null }),
    catch: (reject: Function) => thenablePayments,
  };
  mockSupabaseOrder.mockReturnValue(thenablePayments);

  // .single() is terminal for point queries (next payment date lookup etc.)
  mockSupabaseSingle.mockResolvedValue({ data: null, error: null });

  // QB defaults
  mockRequireAuth.mockResolvedValue(MOCK_USER);
  mockFindOneByCondition.mockResolvedValue(MOCK_MORTGAGE);
  mockUpdate.mockResolvedValue(true);
  mockUpdateMany.mockResolvedValue(true);
  mockCreate.mockResolvedValue({ id: 'txn_new' });

  // Stripe defaults
  mockStripePaymentIntentsCreate.mockResolvedValue(MOCK_PAYMENT_INTENT);
  mockStripePaymentIntentsRetrieve.mockResolvedValue({
    ...MOCK_PAYMENT_INTENT,
    status: 'succeeded',
  });
  mockStripePaymentMethodsRetrieve.mockResolvedValue({
    id: 'pm_test',
    type: 'card',
    card: { brand: 'visa', last4: '4242' },
  });
}

describe('POST /api/mortgages/[id]/make-payment', () => {
  beforeEach(resetMocks);

  it('returns 400 when payment_ids is missing', async () => {
    const req = makePostRequest('mortgage_123', {});
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('At least one payment must be selected');
  });

  it('returns 400 when payment_ids is an empty array', async () => {
    const req = makePostRequest('mortgage_123', { payment_ids: [] });
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('At least one payment must be selected');
  });

  it('returns 404 when mortgage is not found', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(null);

    const req = makePostRequest('missing_id', { payment_ids: ['pay_1'] });
    const res = await POST(req, makeRouteParams('missing_id'));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Mortgage not found');
  });

  it('returns 400 when mortgage status is pending_payment_method', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      status: 'pending_payment_method',
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('not in a valid state');
  });

  it('returns 400 when mortgage status is paused', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      status: 'paused',
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    const res = await POST(req, makeRouteParams('mortgage_123'));

    expect(res.status).toBe(400);
  });

  it('returns 404 when no valid payments found for given IDs', async () => {
    // .order() is terminal — resolve with empty array to simulate no valid payments
    mockSupabaseOrder.mockReturnValueOnce({
      ...chainObj,
      then: (resolve:any) => resolve({ data: [], error: null }),
      catch: (reject:any) => ({}),
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_already_paid'] });
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toContain('No valid payments found');
  });

  it('returns 404 when supabase returns an error fetching payments', async () => {
    // .order() is terminal — resolve with error to simulate DB failure
    mockSupabaseOrder.mockReturnValueOnce({
      ...chainObj,
      then: (resolve:any) => resolve({ data: null, error: { message: 'DB error' } }),
      catch: (reject:any) => ({}),
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    const res = await POST(req, makeRouteParams('mortgage_123'));

    expect(res.status).toBe(404);
  });

  it('creates unconfirmed PaymentIntent and returns client_secret when no payment_method_id', async () => {
    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.client_secret).toBe('pi_test_123_secret');
    expect(json.payment_intent_id).toBe('pi_test_123');
    const createCall = mockStripePaymentIntentsCreate.mock.calls[0][0];
    expect(createCall.confirm).toBeUndefined();
  });

  it('calculates total amount as sum of all selected payments in cents', async () => {
    mockSupabaseOrder.mockReturnValueOnce({
      ...chainObj,
      then: (resolve:any) => resolve({ data: [
        { id: 'pay_1', payment_number: 1, amount: 1000, due_date: '2024-01-01', status: 'scheduled' },
        { id: 'pay_2', payment_number: 2, amount: 1000, due_date: '2024-02-01', status: 'failed' },
      ], error: null }),
      catch: (reject:any) => ({}),
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1', 'pay_2'] });
    await POST(req, makeRouteParams('mortgage_123'));

    expect(mockStripePaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 200000 })
    );
  });

  it('sets description as "Mortgage Payment #N" for a single payment', async () => {
    mockSupabaseOrder.mockReturnValueOnce({
      ...chainObj,
      then: (resolve:any) => resolve({ data: [
        { id: 'pay_1', payment_number: 5, amount: 1000, due_date: '2024-01-01', status: 'scheduled' },
      ], error: null }),
      catch: (reject:any) => ({}),
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    await POST(req, makeRouteParams('mortgage_123'));

    expect(mockStripePaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Mortgage Payment #5' })
    );
  });

  it('sets description as "Mortgage Payments #N, #M" for multiple payments', async () => {
    mockSupabaseOrder.mockReturnValueOnce({
      ...chainObj,
      then: (resolve:any) => resolve({ data: [
        { id: 'pay_1', payment_number: 1, amount: 1000, due_date: '2024-01-01', status: 'scheduled' },
        { id: 'pay_2', payment_number: 2, amount: 1000, due_date: '2024-02-01', status: 'failed' },
      ], error: null }),
      catch: (reject:any) => ({}),
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1', 'pay_2'] });
    await POST(req, makeRouteParams('mortgage_123'));

    expect(mockStripePaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Mortgage Payments #1, #2' })
    );
  });

  it('creates a transaction record with status: pending', async () => {
    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    await POST(req, makeRouteParams('mortgage_123'));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'pending',
        type: 'mortgage_payment',
        mortgage_id: 'mortgage_123',
      })
    );
  });

  it('updates mortgage_payments to status: processing', async () => {
    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    await POST(req, makeRouteParams('mortgage_123'));

    expect(mockUpdateMany).toHaveBeenCalledWith(
      ['pay_1'],
      expect.objectContaining({ status: 'processing' })
    );
  });

  it('does not crash when updateMany returns null', async () => {
    mockUpdateMany.mockResolvedValueOnce(null);

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    const res = await POST(req, makeRouteParams('mortgage_123'));

    expect(res.status).toBe(200);
  });

  it('confirms PaymentIntent immediately when payment_method_id is provided', async () => {
    mockStripePaymentIntentsCreate.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'succeeded',
    });

    const req = makePostRequest('mortgage_123', {
      payment_ids: ['pay_1'],
      payment_method_id: 'pm_card_123',
    });
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('succeeded');
    const createCall = mockStripePaymentIntentsCreate.mock.calls[0][0];
    expect(createCall.confirm).toBe(true);
    expect(createCall.off_session).toBe(false);
    expect(createCall.payment_method).toBe('pm_card_123');
  });

  it('returns requires_action: true when PaymentIntent needs 3DS', async () => {
    mockStripePaymentIntentsCreate.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'requires_action',
    });

    const req = makePostRequest('mortgage_123', {
      payment_ids: ['pay_1'],
      payment_method_id: 'pm_card_123',
    });
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.requires_action).toBe(true);
  });

  it('sets mandate_data for us_bank_account payment method', async () => {
    mockStripePaymentMethodsRetrieve.mockResolvedValueOnce({
      id: 'pm_bank_123',
      type: 'us_bank_account',
      us_bank_account: { bank_name: 'Chase', last4: '6789' },
    });

    const req = makePostRequest('mortgage_123', {
      payment_ids: ['pay_1'],
      payment_method_id: 'pm_bank_123',
    });
    await POST(req, makeRouteParams('mortgage_123'));

    const createCall = mockStripePaymentIntentsCreate.mock.calls[0][0];
    expect(createCall.mandate_data).toBeDefined();
    expect(createCall.mandate_data.customer_acceptance.type).toBe('online');
    expect(createCall.payment_method_options?.us_bank_account).toBeDefined();
  });

  it('sets acss_debit mandate options for acss_debit payment method', async () => {
    mockStripePaymentMethodsRetrieve.mockResolvedValueOnce({
      id: 'pm_acss_123',
      type: 'acss_debit',
      acss_debit: { bank_name: 'TD', last4: '1234' },
    });

    const req = makePostRequest('mortgage_123', {
      payment_ids: ['pay_1'],
      payment_method_id: 'pm_acss_123',
    });
    await POST(req, makeRouteParams('mortgage_123'));

    const createCall = mockStripePaymentIntentsCreate.mock.calls[0][0];
    expect(createCall.payment_method_options?.acss_debit).toBeDefined();
    expect(createCall.payment_method_options.acss_debit.mandate_options.payment_schedule).toBe('sporadic');
  });

  it('includes payment_intent_id, amount, and payments array in response', async () => {
    mockSupabaseOrder.mockReturnValueOnce({
      ...chainObj,
      then: (resolve:any) => resolve({ data: [
        { id: 'pay_1', payment_number: 1, amount: 1000, due_date: '2024-01-01', status: 'scheduled' },
      ], error: null }),
      catch: (reject:any) => ({}),
    });

    const req = makePostRequest('mortgage_123', { payment_ids: ['pay_1'] });
    const res = await POST(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.payment_intent_id).toBe('pi_test_123');
    expect(json.amount).toBe(1000);
    expect(json.payments).toHaveLength(1);
    expect(json.payments[0].id).toBe('pay_1');
  });
});

describe('PUT /api/mortgages/[id]/make-payment', () => {
  beforeEach(resetMocks);

  it('returns 400 when payment_intent_id is missing', async () => {
    const req = makePutRequest('mortgage_123', { payment_ids: ['pay_1'] });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('payment_intent_id is required');
  });

  it('returns 404 when mortgage is not found', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(null);

    const req = makePutRequest('missing_id', {
      payment_intent_id: 'pi_test',
      payment_ids: ['pay_1'],
    });
    const res = await PUT(req, makeRouteParams('missing_id'));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Mortgage not found');
  });

  it('marks payments as succeeded when PaymentIntent is succeeded', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'succeeded',
    });
    mockSupabaseSingle.mockResolvedValueOnce({
      data: { due_date: '2025-08-01' },
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockUpdateMany).toHaveBeenCalledWith(
      ['pay_1'],
      expect.objectContaining({ status: 'succeeded' })
    );
  });

  it('treats PaymentIntent processing status same as succeeded', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'processing',
    });
    mockSupabaseSingle.mockResolvedValueOnce({
      data: { due_date: '2025-08-01' },
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it('increments payments_made correctly and returns new_total_paid', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'succeeded',
    });
    mockSupabaseSingle.mockResolvedValueOnce({
      data: { due_date: '2025-08-01' },
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.new_total_paid).toBe(6); // payments_made(5) + 1
  });

  it('marks mortgage as completed when last payment is made', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      payments_made: 23,
      total_payments: 24,
      number_of_payments: 24,
    });
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'succeeded',
    });
    mockSupabaseSingle.mockResolvedValueOnce({ data: null, error: null });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_24'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.is_mortgage_completed).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'completed' })
    );
  });

  it('mortgage stays active and returns next_payment_date when payments remain', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'succeeded',
    });

    mockSupabaseSingle
      .mockResolvedValueOnce({ data: { due_date: '2025-08-01' }, error: null });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.is_mortgage_completed).toBe(false);
    expect(json.next_payment_date).toBe('2025-08-01');
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'active' })
    );
  });

  it('updates transaction status to completed on success', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'succeeded',
    });
    mockSupabaseSingle.mockResolvedValueOnce({
      data: { due_date: '2025-08-01' },
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    await PUT(req, makeRouteParams('mortgage_123'));

    expect(mockSupabaseUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'completed' })
    );
  });

  it('reverts overdue payments to failed and future payments to scheduled on failure', async () => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setMonth(pastDate.getMonth() - 1);
    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + 2);

    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'requires_payment_method',
      last_payment_error: { message: 'Card declined' },
    });

    mockSupabaseIn.mockResolvedValueOnce({
      data: [
        { id: 'pay_past', due_date: pastDate.toISOString().split('T')[0] },
        { id: 'pay_future', due_date: futureDate.toISOString().split('T')[0] },
      ],
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_past', 'pay_future'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(false);

    const updateCalls = mockUpdate.mock.calls;
    const statuses = updateCalls.map((c) => c[1]?.status).filter(Boolean);
    expect(statuses).toContain('failed');
    expect(statuses).toContain('scheduled');
  });

  it('applies same revert logic for canceled PaymentIntent status', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'canceled',
      last_payment_error: null,
    });
    mockSupabaseIn.mockResolvedValueOnce({
      data: [{ id: 'pay_1', due_date: '2024-01-01' }],
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.success).toBe(false);
  });

  it('updates transaction to failed status on payment failure', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'requires_payment_method',
      last_payment_error: { message: 'Insufficient funds' },
    });
    mockSupabaseIn.mockResolvedValueOnce({
      data: [{ id: 'pay_1', due_date: '2024-01-01' }],
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    await PUT(req, makeRouteParams('mortgage_123'));

    expect(mockSupabaseUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'failed' })
    );
  });

  it('returns 400 for an unexpected PaymentIntent status', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'requires_capture',
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: ['pay_1'],
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Unexpected payment status');
  });

  it('handles payment_ids as a comma-separated string instead of array', async () => {
    mockStripePaymentIntentsRetrieve.mockResolvedValueOnce({
      ...MOCK_PAYMENT_INTENT,
      status: 'succeeded',
    });
    mockSupabaseSingle.mockResolvedValueOnce({
      data: { due_date: '2025-08-01' },
      error: null,
    });

    const req = makePutRequest('mortgage_123', {
      payment_intent_id: 'pi_test_123',
      payment_ids: 'pay_1,pay_2', // string not array
    });
    const res = await PUT(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockUpdateMany).toHaveBeenCalledWith(
      ['pay_1', 'pay_2'],
      expect.objectContaining({ status: 'succeeded' })
    );
  });
});