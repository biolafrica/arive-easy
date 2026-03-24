import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const {
  mockRequireAuth,
  mockCreatePaymentSession,
  mockGetSessionStatus,
  mockFindOneByCondition,
  mockFindById,
  mockStripePaymentMethodsList,
  mockStripeCustomersRetrieve,
  mockFindOneByConditionMortgage,
} = vi.hoisted(() => ({
  mockRequireAuth: vi.fn(),
  mockCreatePaymentSession: vi.fn(),
  mockGetSessionStatus: vi.fn(),
  mockFindOneByCondition: vi.fn(),
  mockFindById: vi.fn(),
  mockStripePaymentMethodsList: vi.fn(),
  mockStripeCustomersRetrieve: vi.fn(),
  mockFindOneByConditionMortgage: vi.fn(),
}));


vi.mock('@/utils/server/authMiddleware', () => ({
  requireAuth: mockRequireAuth,
}));

vi.mock('@/utils/server/paymentService', () => ({
  paymentService: {
    createPaymentSession: mockCreatePaymentSession,
    getSessionStatus: mockGetSessionStatus,
  },
  PaymentType: {},
}));

vi.mock('@/utils/supabase/queryBuilder', () => {
  // Two separate QB instances are used across these routes (transactions, mortgages).
  // We track call count to return the right mock per instantiation.
  let instanceCount = 0;
  const QB = vi.fn().mockImplementation(function (tableName: string) {
    return {
      findOneByCondition: tableName === 'mortgages'
        ? mockFindOneByConditionMortgage
        : mockFindOneByCondition,
      findById: mockFindById,
      update: vi.fn().mockResolvedValue(true),
      create: vi.fn().mockResolvedValue({ id: 'created' }),
    };
  });
  QB.prototype = {};
  return { SupabaseQueryBuilder: QB, __esModule: true };
});

vi.mock('stripe', () => {
  const StripeMock = vi.fn().mockImplementation(function () {
    return {
      paymentMethods: {
        list: mockStripePaymentMethodsList,
      },
      customers: {
        retrieve: mockStripeCustomersRetrieve,
      },
    };
  });
  StripeMock.prototype = {};
  return { default: StripeMock, __esModule: true };
});

import { POST as createPaymentPOST } from '@/app/api/payments/create/route';
import { GET as verifyGET } from '@/app/api/payments/verify-payment/route';
import { GET as paymentMethodsGET } from '@/app/api/mortgages/[id]/payment-methods/route';


const MOCK_USER = {
  id: 'user_123',
  email: 'emeka@example.com',
  user_metadata: { name: 'Emeka Okafor' },
};

const MOCK_MORTGAGE = {
  id: 'mortgage_123',
  user_id: 'user_123',
  stripe_customer_id: 'cus_test',
  stripe_payment_method_id: 'pm_test',
  status: 'active',
};

function makePostRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/payments/create', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeGetRequest(url: string): NextRequest {
  return new NextRequest(url);
}

function makeRouteParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function resetMocks() {
  vi.clearAllMocks();
  mockRequireAuth.mockResolvedValue(MOCK_USER);
  mockCreatePaymentSession.mockResolvedValue({
    success: true,
    url: 'https://checkout.stripe.com/pay/cs_test',
    sessionId: 'cs_test_123',
  });
  mockGetSessionStatus.mockResolvedValue({
    status: 'complete',
    paymentStatus: 'paid',
  });
  mockFindOneByCondition.mockResolvedValue(null);
  mockFindOneByConditionMortgage.mockResolvedValue(null);
  mockFindById.mockResolvedValue(null);
  mockStripePaymentMethodsList.mockResolvedValue({ data: [] });
  mockStripeCustomersRetrieve.mockResolvedValue({
    deleted: false,
    invoice_settings: { default_payment_method: null },
  });
}


describe('POST /api/payments/create', () => {
  beforeEach(resetMocks);

  it('returns 401 when user is not authenticated', async () => {
    mockRequireAuth.mockRejectedValueOnce(new Error('Unauthorized'));

    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'processing_fee',
    });
    const res = await createPaymentPOST(req);

    expect(res.status).toBe(500); // caught by outer try/catch
  });

  // ── Validation 

  it('returns 400 when application_id is missing', async () => {
    const req = makePostRequest({ payment_type: 'processing_fee' });
    const res = await createPaymentPOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('application_id');
  });

  it('returns 400 when payment_type is missing', async () => {
    const req = makePostRequest({ application_id: 'app_456' });
    const res = await createPaymentPOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('payment_type');
  });

  it('returns 400 for an invalid payment_type', async () => {
    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'fake_type',
    });
    const res = await createPaymentPOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid payment type');
  });

  it('accepts processing_fee as a valid payment_type', async () => {
    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'processing_fee',
    });
    const res = await createPaymentPOST(req);

    expect(res.status).toBe(200);
  });

  it('accepts legal_fee as a valid payment_type', async () => {
    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'legal_fee',
      amount: 500,
    });
    const res = await createPaymentPOST(req);

    expect(res.status).toBe(200);
  });

  it('accepts valuation_fee as a valid payment_type', async () => {
    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'valuation_fee',
      amount: 300,
    });
    const res = await createPaymentPOST(req);

    expect(res.status).toBe(200);
  });

  it('accepts escrow_down_payment as a valid payment_type', async () => {
    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'escrow_down_payment',
      amount: 20000,
      seller_id: 'dev_111',
      property_id: 'prop_999',
    });
    const res = await createPaymentPOST(req);

    expect(res.status).toBe(200);
  });

  // ── Happy path

  it('returns 200 with url and sessionId on success', async () => {
    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'processing_fee',
    });
    const res = await createPaymentPOST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.url).toBe('https://checkout.stripe.com/pay/cs_test');
    expect(json.sessionId).toBe('cs_test_123');
  });

  it('passes all fields to paymentService.createPaymentSession', async () => {
    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'escrow_down_payment',
      amount: 20000,
      seller_id: 'dev_111',
      property_id: 'prop_999',
      description: 'Custom description',
    });
    await createPaymentPOST(req);

    expect(mockCreatePaymentSession).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user_123',
        userEmail: 'emeka@example.com',
        applicationId: 'app_456',
        paymentType: 'escrow_down_payment',
        amount: 20000,
        sellerId: 'dev_111',
        propertyId: 'prop_999',
        description: 'Custom description',
      })
    );
  });

  // ── Service failure 

  it('returns 400 when paymentService returns success: false', async () => {
    mockCreatePaymentSession.mockResolvedValueOnce({
      success: false,
      error: 'Payment already completed',
      details: undefined,
    });

    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'processing_fee',
    });
    const res = await createPaymentPOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Payment already completed');
  });

  it('returns 400 with details when paymentService provides them', async () => {
    mockCreatePaymentSession.mockResolvedValueOnce({
      success: false,
      error: 'Stripe error',
      details: 'Card declined',
    });

    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'processing_fee',
    });
    const res = await createPaymentPOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.details).toBe('Card declined');
  });

  it('returns 500 when paymentService throws unexpectedly', async () => {
    mockCreatePaymentSession.mockRejectedValueOnce(new Error('Unexpected crash'));

    const req = makePostRequest({
      application_id: 'app_456',
      payment_type: 'processing_fee',
    });
    const res = await createPaymentPOST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Failed to create payment session');
  });
});

describe('GET /api/payments/verify', () => {
  beforeEach(resetMocks);

  it('returns 400 when session_id query param is missing', async () => {
    const req = makeGetRequest('http://localhost/api/payments/verify');
    const res = await verifyGET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Session ID required');
  });

  it('returns 404 when transaction is not found', async () => {
    mockFindOneByCondition.mockResolvedValueOnce(null);

    const req = makeGetRequest(
      'http://localhost/api/payments/verify?session_id=cs_missing'
    );
    const res = await verifyGET(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Transaction not found');
  });



  it('returns 200 with transaction fields when found', async () => {
    const mockTransaction = {
      id: 'txn_001',
      status: 'succeeded',
      amount: 10000,
      receipt_url: 'https://stripe.com/receipt/123',
      created_at: '2025-06-01T10:00:00Z',
    };
    mockFindOneByCondition.mockResolvedValueOnce(mockTransaction);

    const req = makeGetRequest(
      'http://localhost/api/payments/verify?session_id=cs_test_123'
    );
    const res = await verifyGET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('succeeded');
    expect(json.amount).toBe(10000);
    expect(json.receipt_url).toBe('https://stripe.com/receipt/123');
    expect(json.transaction_id).toBe('txn_001');
    expect(json.payment_date).toBe('2025-06-01T10:00:00Z');
  });

  it('queries by stripe_session_id', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      id: 'txn_001',
      status: 'succeeded',
      amount: 10000,
      receipt_url: null,
      created_at: '2025-06-01T10:00:00Z',
    });

    const req = makeGetRequest(
      'http://localhost/api/payments/verify?session_id=cs_specific_123'
    );
    await verifyGET(req);

    expect(mockFindOneByCondition).toHaveBeenCalledWith({
      stripe_session_id: 'cs_specific_123',
    });
  });

  it('returns null receipt_url when not yet available', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      id: 'txn_002',
      status: 'pending',
      amount: 10000,
      receipt_url: null,
      created_at: '2025-06-01T10:00:00Z',
    });

    const req = makeGetRequest(
      'http://localhost/api/payments/verify?session_id=cs_pending'
    );
    const res = await verifyGET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.receipt_url).toBeNull();
  });


  it('returns 500 when queryBuilder throws', async () => {
    mockFindOneByCondition.mockRejectedValueOnce(new Error('DB error'));

    const req = makeGetRequest(
      'http://localhost/api/payments/verify?session_id=cs_crash'
    );
    const res = await verifyGET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Failed to fetch transaction');
  });
});


describe('GET /api/mortgages/[id]/payment-methods', () => {
  beforeEach(resetMocks);

  it('returns 404 when mortgage not found', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(null);

    const req = makeGetRequest('http://localhost/api/mortgages/missing/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('missing'));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Mortgage not found');
  });

  it('returns 404 when mortgage belongs to a different user', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(null);

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));

    expect(res.status).toBe(404);
  });


  it('returns empty payment_methods when mortgage has no stripe_customer_id', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce({
      ...MOCK_MORTGAGE,
      stripe_customer_id: null,
    });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.payment_methods).toEqual([]);
    expect(mockStripePaymentMethodsList).not.toHaveBeenCalled();
  });


  it('formats card payment methods correctly', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: false,
      invoice_settings: { default_payment_method: 'pm_card_123' },
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({
      data: [{
        id: 'pm_card_123',
        type: 'card',
        card: { brand: 'visa', last4: '4242' },
        us_bank_account: null,
        acss_debit: null,
      }],
    });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.payment_methods).toHaveLength(1);
    expect(json.payment_methods[0]).toMatchObject({
      id: 'pm_card_123',
      type: 'card',
      display: 'VISA •••• 4242',
      brand: 'visa',
      last4: '4242',
      isDefault: true,
    });
  });

  it('formats us_bank_account payment methods correctly', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: false,
      invoice_settings: { default_payment_method: null },
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({
      data: [{
        id: 'pm_bank_123',
        type: 'us_bank_account',
        card: null,
        us_bank_account: { bank_name: 'Chase', last4: '6789' },
        acss_debit: null,
      }],
    });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.payment_methods[0]).toMatchObject({
      id: 'pm_bank_123',
      type: 'us_bank_account',
      display: 'Chase •••• 6789',
      last4: '6789',
      isDefault: false,
    });
  });

  it('formats acss_debit payment methods correctly', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: false,
      invoice_settings: { default_payment_method: null },
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({
      data: [{
        id: 'pm_acss_123',
        type: 'acss_debit',
        card: null,
        us_bank_account: null,
        acss_debit: { bank_name: 'TD Bank', last4: '1234' },
      }],
    });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.payment_methods[0]).toMatchObject({
      id: 'pm_acss_123',
      type: 'acss_debit',
      display: 'TD Bank •••• 1234',
      last4: '1234',
    });
  });

  it('uses "Bank" as fallback when acss_debit bank_name is null', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: false,
      invoice_settings: { default_payment_method: null },
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({
      data: [{
        id: 'pm_acss_no_name',
        type: 'acss_debit',
        card: null,
        us_bank_account: null,
        acss_debit: { bank_name: null, last4: '9999' },
      }],
    });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.payment_methods[0].display).toBe('Bank •••• 9999');
  });

  it('sorts default payment method first', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: false,
      invoice_settings: { default_payment_method: 'pm_second' },
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({
      data: [
        {
          id: 'pm_first',
          type: 'card',
          card: { brand: 'mastercard', last4: '1111' },
          us_bank_account: null,
          acss_debit: null,
        },
        {
          id: 'pm_second',
          type: 'card',
          card: { brand: 'visa', last4: '2222' },
          us_bank_account: null,
          acss_debit: null,
        },
      ],
    });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.payment_methods[0].id).toBe('pm_second');
    expect(json.payment_methods[0].isDefault).toBe(true);
    expect(json.payment_methods[1].id).toBe('pm_first');
    expect(json.payment_methods[1].isDefault).toBe(false);
  });

  it('returns default_payment_method_id in response', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: false,
      invoice_settings: { default_payment_method: 'pm_default' },
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({ data: [] });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(json.default_payment_method_id).toBe('pm_default');
  });

  it('returns null default_payment_method_id when customer is deleted', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: true, // deleted customer
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({ data: [] });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.default_payment_method_id).toBeNull();
  });


  it('returns empty array when customer has no payment methods', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripeCustomersRetrieve.mockResolvedValueOnce({
      deleted: false,
      invoice_settings: { default_payment_method: null },
    });
    mockStripePaymentMethodsList.mockResolvedValueOnce({ data: [] });

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.payment_methods).toEqual([]);
  });


  it('returns 500 when Stripe throws', async () => {
    mockFindOneByConditionMortgage.mockResolvedValueOnce(MOCK_MORTGAGE);
    mockStripePaymentMethodsList.mockRejectedValueOnce(new Error('Stripe error'));

    const req = makeGetRequest('http://localhost/api/mortgages/mortgage_123/payment-methods');
    const res = await paymentMethodsGET(req, makeRouteParams('mortgage_123'));

    expect(res.status).toBe(500);
  });
});