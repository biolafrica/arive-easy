import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const {
  mockCreate,
  mockFindOneByCondition,
  mockUpdate,
  mockFindById,
  mockStripeSessionCreate,
  mockStripeSessionRetrieve,
} = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindOneByCondition: vi.fn(),
  mockUpdate: vi.fn(),
  mockFindById: vi.fn(),
  mockStripeSessionCreate: vi.fn(),
  mockStripeSessionRetrieve: vi.fn(),
}));

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('@/utils/supabase/queryBuilder', () => {
  const QB = vi.fn().mockImplementation(function () {
    return {
      create: mockCreate,
      findOneByCondition: mockFindOneByCondition,
      update: mockUpdate,
      findById: mockFindById,
    };
  });
  QB.prototype = {};
  return { SupabaseQueryBuilder: QB, __esModule: true };
});

vi.mock('stripe', () => {
  const StripeMock = vi.fn().mockImplementation(function () {
    return {
      checkout: {
        sessions: {
          create: mockStripeSessionCreate,
          retrieve: mockStripeSessionRetrieve,
        },
      },
    };
  });
  StripeMock.prototype = {};
  return { default: StripeMock, __esModule: true };
});

// ─── Import after mocks ───────────────────────────────────────────────────────
import { PaymentService, PaymentType } from '@/utils/server/paymentService';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_PARAMS = {
  userId: 'user_123',
  userEmail: 'emeka@example.com',
  userName: 'Emeka Okafor',
  applicationId: 'app_456',
};

const MOCK_SESSION = {
  id: 'cs_test_123',
  url: 'https://checkout.stripe.com/pay/cs_test_123',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  status: 'open',
  payment_status: 'unpaid',
};

const MOCK_TRANSACTION = {
  id: 'txn_001',
  status: 'pending',
  stripe_session_id: 'cs_test_123',
  metadata: {
    session_url: 'https://checkout.stripe.com/pay/cs_test_123',
    expires_at: new Date(Date.now() + 3600000).toISOString(),
  },
};

function resetMocks() {
  vi.clearAllMocks();
  mockCreate.mockResolvedValue(MOCK_TRANSACTION);
  mockFindOneByCondition.mockResolvedValue(null); // no existing transaction by default
  mockUpdate.mockResolvedValue(true);
  mockFindById.mockResolvedValue(null);
  mockStripeSessionCreate.mockResolvedValue(MOCK_SESSION);
  mockStripeSessionRetrieve.mockResolvedValue({
    status: 'complete',
    payment_status: 'paid',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// validatePaymentParams (tested indirectly via createPaymentSession)
// ─────────────────────────────────────────────────────────────────────────────

describe('PaymentService — validatePaymentParams', () => {
  let service: PaymentService;
  beforeEach(() => {
    resetMocks();
    service = new PaymentService();
  });

  it('accepts processing_fee with no amount (uses fixedAmount: 100)', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
      // no amount — should use fixedAmount
    });
    expect(result.success).toBe(true);
    expect(result.url).toBe(MOCK_SESSION.url);
  });

  it('rejects legal_fee when amount is missing', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'legal_fee',
      // no amount
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Amount is required');
  });

  it('rejects valuation_fee when amount is missing', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'valuation_fee',
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Amount is required');
  });

  it('rejects legal_fee when amount is below minAmount ($1)', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'legal_fee',
      amount: 0.5,
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Minimum amount');
  });

  it('accepts legal_fee with valid amount', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'legal_fee',
      amount: 500,
    });
    expect(result.success).toBe(true);
  });

  it('rejects escrow_down_payment when sellerId is missing', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'escrow_down_payment',
      amount: 20000,
      propertyId: 'prop_999',
      // no sellerId
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Seller ID is required for this payment type');
  });

  it('rejects escrow_down_payment when propertyId is missing', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'escrow_down_payment',
      amount: 20000,
      sellerId: 'dev_111',
      // no propertyId
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Property ID is required for this payment type');
  });

  it('accepts escrow_down_payment with all required fields', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'escrow_down_payment',
      amount: 20000,
      sellerId: 'dev_111',
      propertyId: 'prop_999',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid payment type', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'invalid_type' as PaymentType,
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid payment type');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkExistingPayment — duplicate guard
// ─────────────────────────────────────────────────────────────────────────────

describe('PaymentService — checkExistingPayment (duplicate guard)', () => {
  let service: PaymentService;
  beforeEach(() => {
    resetMocks();
    service = new PaymentService();
  });

  it('blocks a second processing_fee payment when one already succeeded', async () => {
    // First call: findOneByCondition returns a succeeded transaction
    mockFindOneByCondition.mockResolvedValueOnce({
      id: 'txn_existing',
      status: 'succeeded',
      type: 'processing_fee',
    });

    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Payment already completed');
  });

  it('blocks duplicate for legal_fee', async () => {
    mockFindOneByCondition.mockResolvedValueOnce({
      id: 'txn_legal',
      status: 'succeeded',
      type: 'legal_fee',
    });

    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'legal_fee',
      amount: 500,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Payment already completed');
  });

  it('returns success when a valid pending transaction exists (continues to new session)', async () => {
    const futureExpiry = new Date(Date.now() + 3600000).toISOString();
 
    mockFindOneByCondition.mockResolvedValueOnce(null); // no succeeded transaction
    mockFindOneByCondition.mockResolvedValueOnce({      // valid pending transaction
      id: 'txn_pending',
      status: 'pending',
      type: 'processing_fee',
      stripe_session_id: 'cs_existing',
      metadata: {
        session_url: 'https://checkout.stripe.com/pay/cs_existing',
        expires_at: futureExpiry,
      },
    });
 
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });
 
    // createPaymentSession proceeds to create a new Stripe session
    expect(result.success).toBe(true);
    expect(mockStripeSessionCreate).toHaveBeenCalledTimes(1);
  });

  it('marks expired pending transaction as expired and creates a new session', async () => {
    const pastExpiry = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago

    // First findOneByCondition: no succeeded transaction
    mockFindOneByCondition.mockResolvedValueOnce(null);
    // Second findOneByCondition: pending but expired
    mockFindOneByCondition.mockResolvedValueOnce({
      id: 'txn_expired',
      status: 'pending',
      type: 'processing_fee',
      stripe_session_id: 'cs_old',
      metadata: {
        session_url: 'https://checkout.stripe.com/pay/cs_old',
        expires_at: pastExpiry,
      },
    });

    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    // Should have marked old transaction as expired
    expect(mockUpdate).toHaveBeenCalledWith(
      'txn_expired',
      expect.objectContaining({ status: 'expired' })
    );
    // Should have created a brand new Stripe session
    expect(mockStripeSessionCreate).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.url).toBe(MOCK_SESSION.url);
  });

  it('allows a new session when no existing transactions found', async () => {
    // Both findOneByCondition calls return null (no succeeded, no pending)
    mockFindOneByCondition.mockResolvedValue(null);

    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(result.success).toBe(true);
    expect(mockStripeSessionCreate).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// createPaymentSession — full flow per payment type
// ─────────────────────────────────────────────────────────────────────────────

describe('PaymentService — createPaymentSession (full flow)', () => {
  let service: PaymentService;
  beforeEach(() => {
    resetMocks();
    service = new PaymentService();
  });

  it('creates a Stripe session and transaction for processing_fee', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(result.success).toBe(true);
    expect(result.url).toBe(MOCK_SESSION.url);
    expect(result.sessionId).toBe(MOCK_SESSION.id);

    // Stripe session should be created with correct amount (fixedAmount = 100)
    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'payment',
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 10000, // $100 * 100 cents
            }),
          }),
        ]),
      })
    );

    // Transaction record should be created
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user_123',
        application_id: 'app_456',
        type: 'processing_fee',
        status: 'pending',
      })
    );
  });

  it('creates a Stripe session with correct amount for legal_fee', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'legal_fee',
      amount: 750,
    });

    expect(result.success).toBe(true);
    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 75000, // $750 * 100
            }),
          }),
        ]),
      })
    );
  });

  it('includes seller_id and property_id in metadata for escrow_down_payment', async () => {
    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'escrow_down_payment',
      amount: 20000,
      sellerId: 'dev_111',
      propertyId: 'prop_999',
    });

    expect(result.success).toBe(true);
    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          seller_id: 'dev_111',
          property_id: 'prop_999',
          payment_type: 'escrow_down_payment',
        }),
      })
    );
  });

  it('includes user_id and application_id in metadata for all payment types', async () => {
    await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          user_id: 'user_123',
          application_id: 'app_456',
        }),
      })
    );
  });

  it('sets customer_email on the Stripe session', async () => {
    await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: 'emeka@example.com',
      })
    );
  });

  it('creates the transaction with amount in cents (* 100)', async () => {
    await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'legal_fee',
      amount: 500,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 50000, // $500 * 100 cents
        currency: 'usd',
      })
    );
  });

  it('stores session_url and expires_at in transaction metadata', async () => {
    await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          session_url: MOCK_SESSION.url,
        }),
      })
    );
  });

  it('proceeds without crashing when property lookup returns null', async () => {
    // propertyId provided but property not found in DB — should warn but not fail
    mockFindById.mockResolvedValueOnce(null);

    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'escrow_down_payment',
      amount: 20000,
      sellerId: 'dev_111',
      propertyId: 'prop_missing',
    });

    expect(result.success).toBe(true);
  });

  it('returns failure when Stripe session creation throws', async () => {
    mockStripeSessionCreate.mockRejectedValueOnce(new Error('Stripe API error'));

    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create payment session');
    expect(result.details).toBe('Stripe API error');
  });

  it('returns failure when transaction creation throws', async () => {
    mockCreate.mockRejectedValueOnce(new Error('DB write failed'));

    const result = await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create payment session');
  });

  it('uses payment_method_types: card for all checkout sessions', async () => {
    await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'processing_fee',
    });

    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: ['card'],
      })
    );
  });

  it('sets mode to payment for all payment types', async () => {
    await service.createPaymentSession({
      ...BASE_PARAMS,
      paymentType: 'valuation_fee',
      amount: 300,
    });

    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'payment' })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getSessionStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('PaymentService — getSessionStatus', () => {
  let service: PaymentService;
  beforeEach(() => {
    resetMocks();
    service = new PaymentService();
  });

  it('returns status and paymentStatus from Stripe session', async () => {
    mockStripeSessionRetrieve.mockResolvedValueOnce({
      status: 'complete',
      payment_status: 'paid',
    });

    const result = await service.getSessionStatus('cs_test_123');

    expect(result.status).toBe('complete');
    expect(result.paymentStatus).toBe('paid');
  });

  it('returns unknown status when Stripe session has no status', async () => {
    mockStripeSessionRetrieve.mockResolvedValueOnce({
      status: null,
      payment_status: 'unpaid',
    });

    const result = await service.getSessionStatus('cs_test_abc');

    expect(result.status).toBe('unknown');
    expect(result.paymentStatus).toBe('unpaid');
  });

  it('returns open status for an active session', async () => {
    mockStripeSessionRetrieve.mockResolvedValueOnce({
      status: 'open',
      payment_status: 'unpaid',
    });

    const result = await service.getSessionStatus('cs_open');
    expect(result.status).toBe('open');
  });
});