import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const {
  mockConstructEvent,
  mockChargesList,
  mockSendEmail,
  mockCreateNotification,
  mockFindById,
  mockFindOneByCondition,
  mockUpdate,
  mockCreate,
  mockSingle,
  mockLimit,
  mockOrder,
  mockIn,
  mockEq,
  mockSelect,
  mockInsert,
  mockUpdateChain,
  mockFrom,
  mockHeaders,
} = vi.hoisted(() => {
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockLimit = vi.fn().mockReturnValue({ single: mockSingle });
  const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit, single: mockSingle });
  const mockIn = vi.fn().mockResolvedValue({ data: [], error: null });
  const mockEq = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn().mockResolvedValue({ error: null });
  const mockUpdateChain = vi.fn();
  const mockFrom = vi.fn();

  const chainObj = {
    update: mockUpdateChain,
    select: mockSelect,
    insert: mockInsert,
    eq: mockEq,
    in: mockIn,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle,
  };

  mockFrom.mockReturnValue(chainObj);
  mockUpdateChain.mockReturnValue(chainObj);
  mockSelect.mockReturnValue(chainObj);
  mockEq.mockReturnValue(chainObj);
  mockIn.mockReturnValue(chainObj);  // sync — chain must not break here

  return {
    mockConstructEvent: vi.fn(),
    mockChargesList: vi.fn(),
    mockSendEmail: vi.fn().mockResolvedValue(undefined),
    mockCreateNotification: vi.fn().mockResolvedValue(undefined),
    mockFindById: vi.fn(),
    mockFindOneByCondition: vi.fn(),
    mockUpdate: vi.fn(),
    mockCreate: vi.fn(),
    mockSingle,
    mockLimit,
    mockOrder,
    mockIn,
    mockEq,
    mockSelect,
    mockInsert,
    mockUpdateChain,
    mockFrom,
    mockHeaders: vi.fn(),
  };
});


const chainObj = {
  update: mockUpdateChain,
  select: mockSelect,
  insert: mockInsert,
  eq: mockEq,
  in: mockIn,
  order: mockOrder,
  limit: mockLimit,
  single: mockSingle,
};


vi.mock('next/headers', () => ({
  headers: mockHeaders,
}));

vi.mock('stripe', () => {
  const StripeMock = vi.fn().mockImplementation(function () {
    return {
      webhooks: { constructEvent: mockConstructEvent },
      charges: { list: mockChargesList },
      paymentMethods: { list: vi.fn() },
    };
  });
  StripeMock.prototype = {};
  return { default: StripeMock, __esModule: true };
});

vi.mock('@/utils/supabase/queryBuilder', () => {
  const SupabaseQueryBuilderMock = vi.fn().mockImplementation(function () {
    return {
      findById: mockFindById,
      findOneByCondition: mockFindOneByCondition,
      update: mockUpdate,
      create: mockCreate,
    };
  });
  SupabaseQueryBuilderMock.prototype = {};
  return { SupabaseQueryBuilder: SupabaseQueryBuilderMock, __esModule: true };
});

vi.mock('@/utils/supabase/supabaseAdmin', () => ({
  supabaseAdmin: { from: mockFrom },
}));

vi.mock('@/utils/email/send_email', () => ({
  sendEmail: mockSendEmail,
}));

vi.mock('@/utils/notifications/createNotification', () => ({
  createNotification: mockCreateNotification,
}));

vi.mock('@/utils/notifications/notificationContent', () => ({
  buildNotificationPayload: vi.fn().mockReturnValue({}),
}));

vi.mock('@/utils/email/templates/payment-receipt', () => ({
  generalPaymentReceipt: vi.fn().mockReturnValue('<html>receipt</html>'),
  paymentReceiptBody: vi.fn().mockReturnValue('<html>body</html>'),
}));

vi.mock('@/utils/email/templates/direct-debit', () => ({
  getPaymentSuccessEmailTemplate: vi.fn().mockReturnValue('<html>success</html>'),
  getPaymentFailedEmailTemplate: vi.fn().mockReturnValue('<html>failed</html>'),
}));

vi.mock('@/lib/formatter', () => ({
  formatUSD: vi.fn().mockReturnValue('$1,000.00'),
}));

import { POST, GET } from '@/app/api/webhook/stripe/route';


function makeRequest(body: object | string): NextRequest {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  return new NextRequest('http://localhost/api/webhook/stripe', {
    method: 'POST',
    body: raw,
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeEvent(
  type: string,
  data: object,
  overrides: Record<string, unknown> = {}
): object {
  return {
    id: `evt_test_${Date.now()}`,
    type,
    data: { object: data },
    ...overrides,
  };
}

function resetMocks() {
  vi.clearAllMocks();

  // Re-wire the entire chain after clearAllMocks wipes all implementations.
  // Every method must return chainObj synchronously so chains don't break
  // mid-call regardless of how deep the route goes.
  mockFrom.mockReturnValue(chainObj);
  mockUpdateChain.mockReturnValue(chainObj);
  mockSelect.mockReturnValue(chainObj);
  mockEq.mockReturnValue(chainObj);
  mockIn.mockReturnValue(chainObj);             // sync — not mockResolvedValue
  mockOrder.mockReturnValue(chainObj);           // sync — lets .order().limit().single() work
  mockLimit.mockReturnValue(chainObj);           // sync — lets .limit().single() work
  // single() is the terminal async call — default to empty success
  mockSingle.mockResolvedValue({ data: null, error: null });
  mockInsert.mockResolvedValue({ error: null });

  // SupabaseQueryBuilder defaults — return null so the route treats records as
  // "not found" unless a test overrides with mockResolvedValueOnce(...)
  mockFindById.mockResolvedValue(null);
  mockFindOneByCondition.mockResolvedValue(null);
  mockUpdate.mockResolvedValue(true);
  mockCreate.mockResolvedValue({ id: 'created_id' });

  mockSendEmail.mockResolvedValue(undefined);
  mockCreateNotification.mockResolvedValue(undefined);

  // Default: headers() returns a map with a valid stripe-signature
  mockHeaders.mockResolvedValue(
    new Map([['stripe-signature', 'valid_sig']])
  );
}

const MOCK_MORTGAGE = {
  id: 'mortgage_123',
  application_id: 'app_456',
  user_id: 'user_789',
  stripe_customer_id: 'cus_test',
  stripe_subscription_id: 'sub_test',
  stripe_setup_intent_id: 'seti_test',
  stripe_payment_method_id: 'pm_test',
  monthly_payment: 1000,
  total_payments: 24,
  number_of_payments: 24,
  payments_made: 5,
  first_payment_date: '2025-01-01',
  last_payment_date: '2026-12-01',
  payment_day_of_month: 1,
  status: 'active',
};

const MOCK_APPLICATION = {
  id: 'app_456',
  property_id: 'prop_999',
  property_name: 'Lagos Heights Unit 3B',
  application_number: 'APP-2025-001',
  stages_completed: {
    mortgage_activation: {
      completed: false,
      status: 'current',
      data: { direct_debit_status: 'pending_verification' },
    },
  },
};

const MOCK_USER = {
  id: 'user_789',
  name: 'Emeka Okafor',
  email: 'emeka@example.com',
};

describe('GET /api/webhook/stripe', () => {
  it('returns a health check response', async () => {
    const res = await GET();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe('Webhook endpoint is working');
    expect(json.timestamp).toBeDefined();
  });
});

describe('POST /api/webhook/stripe — signature verification', () => {
  beforeEach(resetMocks);

  it('returns 400 when stripe-signature header is missing', async () => {
    mockHeaders.mockResolvedValue(new Map()); // no signature

    const req = makeRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('No signature found');
  });

  it('returns 400 when stripe signature verification fails', async () => {
    mockHeaders.mockResolvedValue(
      new Map([['stripe-signature', 'bad_sig']])
    );
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Signature mismatch');
    });

    const req = makeRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid signature');
  });

  it('returns 200 with { received: true } for a valid signature and unhandled event', async () => {
    mockConstructEvent.mockReturnValue(makeEvent('some.unknown.event', {}));

    const req = makeRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });
});

describe('checkout.session.completed', () => {
  beforeEach(resetMocks);

  it('DEBUG — what is the 500 error for processing_fee', async () => {
    const session = {
      id: 'cs_debug',
      payment_intent: 'pi_debug',
      amount_total: 10000,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        payment_type: 'processing_fee',
        application_id: 'app_456',
        user_id: 'user_789',
        original_amount: '100',
      },
      customer_details: {},
    };
    mockConstructEvent.mockReturnValue(makeEvent('checkout.session.completed', session));
    mockSingle.mockResolvedValueOnce({ data: { id: 'txn_debug', user_id: 'user_789' }, error: null });
    mockFindById.mockResolvedValueOnce(MOCK_USER);
 
    const req = makeRequest({});
    const res = await POST(req);
    const json = await res.json();
    // Print the actual error so we can see what's throwing
    console.log('DEBUG RESPONSE STATUS:', res.status);
    console.log('DEBUG RESPONSE BODY:', JSON.stringify(json));
    // Don't assert — just expose the error
  });

  it('routes processing_fee to processGenericPayment and marks it paid', async () => {
    const session = {
      id: 'cs_test',
      payment_intent: 'pi_test',
      amount_total: 10000,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        payment_type: 'processing_fee',
        application_id: 'app_456',
        user_id: 'user_789',
        original_amount: '100',
      },
      customer_details: { email: 'emeka@example.com' },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.completed', session)
    );

    // updateTransactionBySessionId returns a transaction
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_001', user_id: 'user_789' },
      error: null,
    });

    // findById for user (sendPaymentConfirmationEmail)
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    // Should update applications table with processing_fee_payment_status
    expect(mockFrom).toHaveBeenCalledWith('applications');
    expect(mockUpdateChain).toHaveBeenCalledWith(
      expect.objectContaining({ processing_fee_payment_status: 'paid' })
    );
    // Should send confirmation email
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Payment Receipt - Kletch' })
    );
  });

  it('routes legal_fee to processFeePayment and marks legal_fee_payment_status paid', async () => {
    const session = {
      id: 'cs_legal',
      payment_intent: 'pi_legal',
      amount_total: 50000,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        payment_type: 'legal_fee',
        application_id: 'app_456',
        user_id: 'user_789',
        original_amount: '500',
      },
      customer_details: {},
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.completed', session)
    );
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_002', user_id: 'user_789' },
      error: null,
    });
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION) // for updatePaymentStageData
      .mockResolvedValueOnce(MOCK_USER);        // for sendPaymentConfirmationEmail

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({ legal_fee_payment_status: 'paid' })
    );
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Legal Fee Payment Confirmed - Kletch' })
    );
  });

  it('routes valuation_fee to processFeePayment and marks valuation_fee_payment_status paid', async () => {
    const session = {
      id: 'cs_val',
      payment_intent: 'pi_val',
      amount_total: 30000,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        payment_type: 'valuation_fee',
        application_id: 'app_456',
        user_id: 'user_789',
        original_amount: '300',
      },
      customer_details: {},
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.completed', session)
    );
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_003', user_id: 'user_789' },
      error: null,
    });
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({ valuation_fee_payment_status: 'paid' })
    );
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Valuation Fee Payment Confirmed - Kletch' })
    );
  });

  it('routes escrow_down_payment to processEscrowPayment and reserves the property', async () => {
    const session = {
      id: 'cs_escrow',
      payment_intent: 'pi_escrow',
      amount_total: 2000000,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        payment_type: 'escrow_down_payment',
        application_id: 'app_456',
        user_id: 'user_789',
        original_amount: '20000',
        property_id: 'prop_999',
        seller_id: 'dev_111',
      },
      customer_details: {},
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.completed', session)
    );
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_004', user_id: 'user_789' },
      error: null,
    });
    // updateTermsStageData calls findById for application
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    // updatePropertyStatus calls findById for application again
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);
    // sendPaymentConfirmationEmail calls findById for user
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    // Property should be set to reserved
    expect(mockUpdate).toHaveBeenCalledWith(
      'prop_999',
      expect.objectContaining({ status: 'reserved' })
    );
    // down_payment_amount should be updated on application
    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({ down_payment_amount: 20000 })
    );
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Escrow Payment Confirmed - Kletch' })
    );
  });

  it('falls back to processGenericPayment when payment_type is missing from metadata', async () => {
    const session = {
      id: 'cs_notype',
      payment_intent: 'pi_notype',
      amount_total: 10000,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: { application_id: 'app_456', user_id: 'user_789' }, // no payment_type
      customer_details: {},
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.completed', session)
    );
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_005', user_id: 'user_789' },
      error: null,
    });
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('applications');
  });

  it('creates an in-app notification for each payment type', async () => {
    const session = {
      id: 'cs_notif',
      payment_intent: 'pi_notif',
      amount_total: 10000,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        payment_type: 'processing_fee',
        application_id: 'app_456',
        user_id: 'user_789',
        original_amount: '100',
      },
      customer_details: {},
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.completed', session)
    );
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_006', user_id: 'user_789' },
      error: null,
    });
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    await POST(req);

    expect(mockCreateNotification).toHaveBeenCalledTimes(1);
  });
});

describe('checkout.session.expired', () => {
  beforeEach(resetMocks);

  it('marks the transaction as cancelled', async () => {
    const session = { id: 'cs_expired' };

    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.expired', session)
    );
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_expired', user_id: 'user_789' },
      error: null,
    });

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdateChain).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'cancelled' })
    );
  });
});

describe('payment_intent.succeeded', () => {
  beforeEach(resetMocks);

  it('routes to handleManualMortgagePaymentSucceeded when mortgage metadata present', async () => {
    const paymentIntent = {
      id: 'pi_manual',
      amount: 100000,
      metadata: {
        mortgage_id: 'mortgage_123',
        user_id: 'user_789',
        payment_ids: 'pay_1,pay_2',
        payment_count: '2',
        payment_numbers: '#1, #2',
      },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('payment_intent.succeeded', paymentIntent)
    );
    mockFindById
      .mockResolvedValueOnce(MOCK_MORTGAGE)  // mortgage
      .mockResolvedValueOnce(MOCK_USER)       // user
      .mockResolvedValueOnce(MOCK_APPLICATION); // application

    // next scheduled payment
    mockSingle.mockResolvedValueOnce({
      data: { due_date: '2025-08-01' },
      error: null,
    });

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    // payments updated to succeeded
    expect(mockFrom).toHaveBeenCalledWith('mortgage_payments');
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: expect.stringContaining('Payment Successful') })
    );
  });

  it('marks mortgage as completed when this was the final payment', async () => {
    const completedMortgage = { ...MOCK_MORTGAGE, payments_made: 23, total_payments: 24 };
    const paymentIntent = {
      id: 'pi_final',
      amount: 100000,
      metadata: {
        mortgage_id: 'mortgage_123',
        user_id: 'user_789',
        payment_ids: 'pay_final',
        payment_count: '1',
        payment_numbers: '#24',
      },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('payment_intent.succeeded', paymentIntent)
    );
    mockFindById
      .mockResolvedValueOnce(completedMortgage)
      .mockResolvedValueOnce(MOCK_USER)
      .mockResolvedValueOnce(MOCK_APPLICATION);
    mockSingle.mockResolvedValueOnce({ data: null, error: null }); // no next payment

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'completed' })
    );
  });

  it('sends receipt URL email when no mortgage metadata present', async () => {
    const paymentIntent = {
      id: 'pi_generic',
      amount: 10000,
      metadata: {}, // no mortgage_id
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('payment_intent.succeeded', paymentIntent)
    );
    // charges.list returns a charge with receipt_url
    mockChargesList.mockResolvedValueOnce({
      data: [{ receipt_url: 'https://stripe.com/receipt/123' }],
    });
    // updateTransactionByPaymentIntentId
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_receipt', user_id: 'user_789' },
      error: null,
    });
    mockFindById.mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Your Payment Receipt is Ready - Kletch',
      })
    );
  });
});

describe('payment_intent.payment_failed', () => {
  beforeEach(resetMocks);

  it('routes to handleManualMortgagePaymentFailed when mortgage metadata present', async () => {
    const paymentIntent = {
      id: 'pi_fail',
      amount: 100000,
      last_payment_error: { message: 'Insufficient funds' },
      metadata: {
        mortgage_id: 'mortgage_123',
        user_id: 'user_789',
        payment_ids: 'pay_1,pay_2',
      },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('payment_intent.payment_failed', paymentIntent)
    );

    // payments to revert (both overdue)
    mockIn.mockResolvedValueOnce({
      data: [
        { id: 'pay_1', due_date: '2024-01-01' }, // overdue
        { id: 'pay_2', due_date: '2024-02-01' }, // overdue
      ],
      error: null,
    });
 
    mockFindById
      .mockResolvedValueOnce(MOCK_MORTGAGE)
      .mockResolvedValueOnce(MOCK_USER)
      .mockResolvedValueOnce(MOCK_APPLICATION);
 
    // failed count check uses .select('*', {count}).eq().eq() — also awaited directly
    const countResult = { count: 2, error: null };
    const thenableChain = {
      ...chainObj,
      then: (resolve: Function) => resolve(countResult),
      catch: (reject: Function) => thenableChain,
    };

    let eqCallCount = 0;
    mockEq.mockImplementation(() => {
      eqCallCount++;
      if (eqCallCount === 5) return thenableChain; // terminal eq of count check
      return chainObj;
    });

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'payment_failed' })
    );
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Payment Failed - Action Required - Kletch' })
    );
  });

  it('reverts overdue payments to failed and future payments to scheduled', async () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + 2);
    const pastDate = new Date(today);
    pastDate.setMonth(pastDate.getMonth() - 1);

    const paymentIntent = {
      id: 'pi_revert',
      amount: 200000,
      last_payment_error: { message: 'Card declined' },
      metadata: {
        mortgage_id: 'mortgage_123',
        user_id: 'user_789',
        payment_ids: 'pay_past,pay_future',
      },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('payment_intent.payment_failed', paymentIntent)
    );

   mockIn.mockResolvedValueOnce({
      data: [
        { id: 'pay_past', due_date: pastDate.toISOString().split('T')[0] },
        { id: 'pay_future', due_date: futureDate.toISOString().split('T')[0] },
      ],
      error: null,
    });
 
    mockFindById
      .mockResolvedValueOnce(MOCK_MORTGAGE)
      .mockResolvedValueOnce(MOCK_USER)
      .mockResolvedValueOnce(MOCK_APPLICATION);
 
    // failed count check
    mockEq.mockResolvedValueOnce({ count: 1, error: null });

    const req = makeRequest({});
    await POST(req);

    // Both payments should be reverted — overdue to 'failed', future to 'scheduled'
    // The route loops and calls supabaseAdmin.from('mortgage_payments').update().eq() per payment
    const updateCalls = mockUpdateChain.mock.calls;
    const statusUpdates = updateCalls.map(call => call[0]?.status).filter(Boolean);
    expect(statusUpdates).toContain('failed');
    expect(statusUpdates).toContain('scheduled');
  });

  it('updates transaction to failed when no mortgage metadata', async () => {
    const paymentIntent = {
      id: 'pi_generic_fail',
      amount: 10000,
      last_payment_error: { message: 'Card declined' },
      metadata: {},
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('payment_intent.payment_failed', paymentIntent)
    );
    mockSingle.mockResolvedValueOnce({
      data: { id: 'txn_fail', user_id: 'user_789' },
      error: null,
    });

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdateChain).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'failed' })
    );
  });
});

describe('setup_intent.succeeded', () => {
  beforeEach(resetMocks);

  it('activates a mortgage in pending_verification status', async () => {
    const setupIntent = {
      id: 'seti_test',
      status: 'succeeded',
      metadata: { application_id: 'app_456', user_id: 'user_789' },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('setup_intent.succeeded', setupIntent)
    );
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      status: 'pending_verification',
    });
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'active' })
    );
    expect(mockUpdate).toHaveBeenCalledWith(
      'app_456',
      expect.objectContaining({ direct_debit_status: 'active' })
    );
  });

  it('activates a mortgage in pending_payment_method status', async () => {
    const setupIntent = {
      id: 'seti_test2',
      status: 'succeeded',
      metadata: { application_id: 'app_456', user_id: 'user_789' },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('setup_intent.succeeded', setupIntent)
    );
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      status: 'pending_payment_method',
    });
    mockFindById.mockResolvedValueOnce(MOCK_APPLICATION);

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'active' })
    );
  });

  it('does nothing when mortgage is already active', async () => {
    const setupIntent = {
      id: 'seti_already_active',
      status: 'succeeded',
      metadata: { application_id: 'app_456' },
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('setup_intent.succeeded', setupIntent)
    );
    mockFindOneByCondition.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      status: 'active', // already active
    });

    const req = makeRequest({});
    await POST(req);

    // update should NOT have been called with 'active' (it was already active)
    expect(mockUpdate).not.toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'active', activated_at: expect.any(String) })
    );
  });

  it('returns 200 without crashing when application_id is missing from metadata', async () => {
    const setupIntent = {
      id: 'seti_no_app',
      status: 'succeeded',
      metadata: {}, // no application_id
    };

    mockConstructEvent.mockReturnValue(
      makeEvent('setup_intent.succeeded', setupIntent)
    );

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('invoice.payment_succeeded', () => {
  beforeEach(resetMocks);

  /** Build a minimal Stripe invoice object */
  function makeInvoice(overrides = {}) {
    return {
      id: 'in_test',
      amount_paid: 100000,
      amount_due: 100000,
      currency: 'usd',
      period_end: Math.floor(Date.now() / 1000),
      parent: {
        subscription_details: { subscription: 'sub_test' },
      },
      payments: {
        data: [{ payment: { payment_intent: 'pi_invoice_test' } }],
      },
      last_finalization_error: null,
      next_payment_attempt: null,
      ...overrides,
    };
  }

  it('marks the next scheduled payment as succeeded', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_succeeded', makeInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
 
    // next scheduled payment — call 1 to mockSingle
    mockSingle.mockResolvedValueOnce({
      data: { id: 'pay_next', payment_number: 6, due_date: '2025-07-01' },
      error: null,
    });
    // update payment → return updated — call 2 to mockSingle
    mockSingle.mockResolvedValueOnce({
      data: { id: 'pay_next', payment_number: 6 },
      error: null,
    });
    // next_payment_date lookup after mortgage update — call 3 to mockSingle
    mockSingle.mockResolvedValueOnce({
      data: { due_date: '2025-08-01' },
      error: null,
    });
 
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);
 
    const req = makeRequest({});
    const res = await POST(req);
 
    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('mortgage_payments');
    expect(mockUpdateChain).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'succeeded' })
    );
  });


  it('increments payments_made on the mortgage', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_succeeded', makeInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE); // payments_made: 5

    mockSingle
      .mockResolvedValueOnce({ data: { id: 'pay_6', payment_number: 6 }, error: null })
      .mockResolvedValueOnce({ data: { id: 'pay_6', payment_number: 6 }, error: null })
      .mockResolvedValueOnce({ data: { due_date:'2025-08-01'}, error: null });

    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ payments_made: 6 }) // 5 + 1
    );
  });

  it('marks mortgage as completed when all payments are done', async () => {
    const almostDone = { ...MOCK_MORTGAGE, payments_made: 23, total_payments: 24 };

    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_succeeded', makeInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(almostDone);

    mockSingle
      .mockResolvedValueOnce({ data: { id: 'pay_24', payment_number: 24 }, error: null })
      .mockResolvedValueOnce({ data: { id: 'pay_24', payment_number: 24 }, error: null });

    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'completed' })
    );
  });

  it('still processes successfully when no scheduled payment is found', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_succeeded', makeInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);

    // No scheduled payment found
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    const res = await POST(req);

    // Should not crash — just skips the payment record update
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ payments_made: 6 })
    );
  });

  it('creates a transaction record for the payment', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_succeeded', makeInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);

    mockSingle
      .mockResolvedValueOnce({ data: { id: 'pay_6', payment_number: 6 }, error: null })
      .mockResolvedValueOnce({ data: { id: 'pay_6', payment_number: 6 }, error: null });

    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mortgage_payment',
        status: 'succeeded',
        mortgage_id: 'mortgage_123',
      })
    );
  });

  it('sends payment success email with correct payment number', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_succeeded', makeInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);

    mockSingle
      .mockResolvedValueOnce({ data: { id: 'pay_6', payment_number: 6 }, error: null })
      .mockResolvedValueOnce({ data: { id: 'pay_6', payment_number: 6 }, error: null });

    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    await POST(req);

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Payment Successful - Kletch' })
    );
  });

  it('returns 200 and skips processing when mortgage not found for subscription', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_succeeded', makeInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(null); // no mortgage found

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('invoice.payment_failed', () => {
  beforeEach(resetMocks);

  function makeFailedInvoice(overrides = {}) {
    return {
      id: 'in_failed',
      amount_due: 100000,
      currency: 'usd',
      parent: {
        subscription_details: { subscription: 'sub_test' },
      },
      payments: {
        data: [{ payment: { payment_intent: 'pi_failed_invoice' } }],
      },
      last_finalization_error: { message: 'Insufficient funds' },
      next_payment_attempt: Math.floor(Date.now() / 1000) + 86400, // tomorrow
      ...overrides,
    };
  }

  it('marks the next scheduled payment as failed', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_failed', makeFailedInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdateChain).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'failed' })
    );
  });

  it('sets mortgage status to payment_failed', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_failed', makeFailedInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'payment_failed' })
    );
  });

  it('sends payment failure email to user', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_failed', makeFailedInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockFindById
      .mockResolvedValueOnce(MOCK_APPLICATION)
      .mockResolvedValueOnce(MOCK_USER);

    const req = makeRequest({});
    await POST(req);

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Payment Failed - Action Required - Kletch',
      })
    );
  });

  it('returns 200 and skips when mortgage not found', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('invoice.payment_failed', makeFailedInvoice())
    );
    mockFindOneByCondition.mockResolvedValueOnce(null);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('customer.subscription.updated', () => {
  beforeEach(resetMocks);

  const statusMappings = [
    { stripeStatus: 'past_due', expectedStatus: 'payment_failed' },
    { stripeStatus: 'canceled', expectedStatus: 'cancelled' },
    { stripeStatus: 'unpaid', expectedStatus: 'cancelled' },
    { stripeStatus: 'paused', expectedStatus: 'paused' },
    { stripeStatus: 'active', expectedStatus: 'active' },
  ];

  statusMappings.forEach(({ stripeStatus, expectedStatus }) => {
    it(`maps Stripe status "${stripeStatus}" to mortgage status "${expectedStatus}"`, async () => {
      const subscription = { id: 'sub_test', status: stripeStatus };

      mockConstructEvent.mockReturnValue(
        makeEvent('customer.subscription.updated', subscription)
      );
      mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);

      const req = makeRequest({});
      await POST(req);

      expect(mockUpdate).toHaveBeenCalledWith(
        'mortgage_123',
        expect.objectContaining({ status: expectedStatus })
      );
    });
  });

  it('defaults to active for unknown subscription status', async () => {
    const subscription = { id: 'sub_test', status: 'some_unknown_status' };

    mockConstructEvent.mockReturnValue(
      makeEvent('customer.subscription.updated', subscription)
    );
    mockFindOneByCondition.mockResolvedValueOnce(MOCK_MORTGAGE);

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'active' })
    );
  });

  it('returns 200 and skips when mortgage not found', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('customer.subscription.updated', { id: 'sub_missing', status: 'active' })
    );
    mockFindOneByCondition.mockResolvedValueOnce(null);

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('customer.subscription.deleted', () => {
  beforeEach(resetMocks);

  it('marks mortgage as completed when all payments have been made', async () => {
    const fullyPaidMortgage = { ...MOCK_MORTGAGE, payments_made: 24, total_payments: 24 };
    const subscription = { id: 'sub_test' };

    mockConstructEvent.mockReturnValue(
      makeEvent('customer.subscription.deleted', subscription)
    );
    mockFindOneByCondition.mockResolvedValueOnce(fullyPaidMortgage);

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'completed' })
    );
  });

  it('marks mortgage as cancelled when payments are still outstanding', async () => {
    const partialMortgage = { ...MOCK_MORTGAGE, payments_made: 10, total_payments: 24 };
    const subscription = { id: 'sub_test' };

    mockConstructEvent.mockReturnValue(
      makeEvent('customer.subscription.deleted', subscription)
    );
    mockFindOneByCondition.mockResolvedValueOnce(partialMortgage);

    const req = makeRequest({});
    await POST(req);

    expect(mockUpdate).toHaveBeenCalledWith(
      'mortgage_123',
      expect.objectContaining({ status: 'cancelled' })
    );
  });

  it('cancels remaining scheduled payments when mortgage is cancelled', async () => {
    const partialMortgage = { ...MOCK_MORTGAGE, payments_made: 10, total_payments: 24 };
    const subscription = { id: 'sub_test' };

    mockConstructEvent.mockReturnValue(
      makeEvent('customer.subscription.deleted', subscription)
    );
    mockFindOneByCondition.mockResolvedValueOnce(partialMortgage);

    const req = makeRequest({});
    await POST(req);

    // Remaining scheduled payments should be cancelled
    expect(mockFrom).toHaveBeenCalledWith('mortgage_payments');
    expect(mockUpdateChain).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'cancelled' })
    );
  });

  it('does NOT cancel scheduled payments when mortgage completes normally', async () => {
    const fullyPaidMortgage = { ...MOCK_MORTGAGE, payments_made: 24, total_payments: 24 };
    const subscription = { id: 'sub_test' };

    mockConstructEvent.mockReturnValue(
      makeEvent('customer.subscription.deleted', subscription)
    );
    mockFindOneByCondition.mockResolvedValueOnce(fullyPaidMortgage);

    const req = makeRequest({});
    await POST(req);

    // The bulk cancellation of scheduled payments should NOT happen on completion
    const cancelCalls = mockUpdateChain.mock.calls.filter(
      call => call[0]?.status === 'cancelled'
    );
    expect(cancelCalls.length).toBe(0);
  });
});

describe('payment_method.attached', () => {
  beforeEach(resetMocks);

  it('handles payment_method.attached without errors (log only)', async () => {
    const paymentMethod = { id: 'pm_attached_test', type: 'card' };

    mockConstructEvent.mockReturnValue(
      makeEvent('payment_method.attached', paymentMethod)
    );

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});

describe('unhandled event types', () => {
  beforeEach(resetMocks);

  it('returns { received: true } and does not crash for unknown event types', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('some.completely.unknown.event', { id: 'obj_unknown' })
    );

    const req = makeRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('global error handling', () => {
  beforeEach(resetMocks);

  it('returns 500 when an unexpected error occurs during processing', async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent('checkout.session.completed', {
        id: 'cs_crash',
        metadata: { payment_type: 'processing_fee' },
      })
    );

    mockFrom.mockImplementationOnce(() => {
      throw new Error('Unexpected DB crash');
    });

    const req = makeRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Webhook processing failed');
  });
});